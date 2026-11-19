import { GoogleGenAI, type Content } from '@google/genai';

type ChatRoleId = 'learner' | 'employer' | 'provider';

interface IncomingTurn {
  role: 'user' | 'model';
  text: string;
}

interface VercelRequestLike {
  method?: string;
  body?: {
    message?: unknown;
    role?: unknown;
    history?: unknown;
  } | string;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const BASE_CAREERNAVE_CONTEXT = `
You are an official CareerNave assistant. CareerNave is a South African workforce development, skills training, and employment platform operating as a division of MBS Utilities (Pty) Ltd, based in Middelburg, Mpumalanga, South Africa.
Contact email: info@careernave.co.za.
Core mission: Close the distance between a qualification and a paycheque by connecting Learners, Employers, Training Providers, and Government Programmes (SETA Discretionary Grants).
Primary focus sectors: Contact Centre Operations, Business Administration, Information Technology (IT), General Security Practices, and Hospitality.
SETA coverage: All 21 South African SETAs (AgriSETA, BANKSETA, CATHSSETA, CETA, CHIETA, ETDP SETA, EWSETA, FASSET, FoodBev SETA, FP&M SETA, HWSETA, INSETA, LGSETA, merSETA, MICT SETA, MQA, PSETA, SASSETA, SERVICES SETA, TETA, W&RSETA).
Keep responses accurate, practical, concise, and grounded in South African skills development context (QCTO, SETA, B-BBEE, SARS Section 12H, WIL). Do not invent statistics, phone numbers, street addresses, or unverified programmes. When users want to apply, host learners, or request a tailored proposal, invite them to use the Contact section on this page or email info@careernave.co.za.
`.trim();

const ROLE_INSTRUCTIONS: Record<ChatRoleId, string> = {
  learner: `${BASE_CAREERNAVE_CONTEXT}

Active Role: Learner Pathway Advisor.
Focus on helping South African learners understand accredited learnerships, internships, Work-Integrated Learning (WIL), career readiness across CareerNave's five focus sectors, and how to connect with host employers and training providers through CareerNave.`,
  employer: `${BASE_CAREERNAVE_CONTEXT}

Active Role: Employer & Incentives Specialist.
Focus on helping South African employers understand how to host learnerships with or without physical office space (including zero-payroll-cost hosting and virtual/remote placements), and how accredited skills programmes support B-BBEE points and SARS Section 12H tax rebates.`,
  provider: `${BASE_CAREERNAVE_CONTEXT}

Active Role: SETA & QCTO Programme Coordinator.
Focus on helping accredited training providers, SDFs, and government programme partners understand QCTO-aligned curriculum delivery, streamlined skills administration, and alignment with SETA Discretionary Grants across all 21 South African SETAs.`,
};

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    return;
  }

  let body: Record<string, unknown> = {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      res.status(400).json({ error: 'Invalid JSON payload.' });
      return;
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body as Record<string, unknown>;
  }

  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';
  const roleKey: ChatRoleId =
    body.role === 'employer' || body.role === 'provider' ? body.role : 'learner';

  if (!rawMessage || rawMessage.length > 2000) {
    res.status(400).json({ error: 'Please enter a message between 1 and 2000 characters.' });
    return;
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: Content[] = rawHistory
    .filter(
      (item: unknown): item is IncomingTurn =>
        Boolean(item) &&
        typeof item === 'object' &&
        ((item as IncomingTurn).role === 'user' || (item as IncomingTurn).role === 'model') &&
        typeof (item as IncomingTurn).text === 'string' &&
        (item as IncomingTurn).text.trim().length > 0
    )
    .slice(-20)
    .map((item: IncomingTurn) => ({
      role: item.role,
      parts: [{ text: item.text.trim() }],
    }));

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const chat = ai.chats.create({
      model: 'gemini-4-hydrogen',
      history,
      config: {
        systemInstruction: ROLE_INSTRUCTIONS[roleKey],
      },
    });

    const response = await chat.sendMessage({ message: rawMessage });
    const reply = response.text?.trim();
    if (!reply) {
      res.status(502).json({ error: 'The assistant returned an empty response. Please try again.' });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    const status =
      typeof (err as { status?: number })?.status === 'number'
        ? (err as { status: number }).status
        : 500;
    const errMsg = err instanceof Error ? err.message : 'Unable to generate a response right now.';
    console.error('Gemini chat error:', err);
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: errMsg });
  }
}

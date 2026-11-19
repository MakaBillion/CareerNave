import { GoogleGenAI, type Content } from '@google/genai';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'contact-messages.json');

interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

type ChatRoleId = 'learner' | 'employer' | 'provider';

interface IncomingTurn {
  role: 'user' | 'model';
  text: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function saveContactMessage(payload: { name: string; email: string; message: string }): ContactRecord {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let existing: ContactRecord[] = [];
  if (fs.existsSync(MESSAGES_FILE)) {
    try {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed;
      }
    } catch {
      existing = [];
    }
  }

  const record: ContactRecord = {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    message: payload.message,
    createdAt: new Date().toISOString(),
  };

  existing.push(record);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  return record;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '128kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.post('/api/contact', (req, res) => {
    const rawName = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const rawMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (rawName.length < 2 || rawName.length > 120) {
      res.status(400).json({ error: 'Please provide your full name (at least 2 characters).' });
      return;
    }
    if (!EMAIL_RE.test(rawEmail) || rawEmail.length > 160) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (rawMessage.length < 10 || rawMessage.length > 4000) {
      res.status(400).json({ error: 'Please enter a message of at least 10 characters.' });
      return;
    }

    try {
      const record = saveContactMessage({
        name: rawName,
        email: rawEmail,
        message: rawMessage,
      });
      res.status(201).json({ id: record.id, received: true });
    } catch (err) {
      console.error('Failed to persist contact enquiry:', err);
      res.status(500).json({ error: 'Unable to store enquiry right now.' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    const rawMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const roleKey: ChatRoleId =
      req.body?.role === 'employer' || req.body?.role === 'provider' ? req.body.role : 'learner';

    if (!rawMessage || rawMessage.length > 2000) {
      res.status(400).json({ error: 'Please enter a message between 1 and 2000 characters.' });
      return;
    }

    const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
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
      const ai = getAiClient();
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

      res.json({ reply });
    } catch (err) {
      const status =
        typeof (err as { status?: number })?.status === 'number'
          ? (err as { status: number }).status
          : 500;
      const errMsg = err instanceof Error ? err.message : 'Unable to generate a response right now.';
      console.error('Gemini chat error:', err);
      res.status(status >= 400 && status < 600 ? status : 500).json({ error: errMsg });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerNave server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

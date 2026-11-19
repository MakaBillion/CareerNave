import crypto from 'crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface VercelRequestLike {
  method?: string;
  body?: {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  } | string;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
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

  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
  const rawMessage = typeof body.message === 'string' ? body.message.trim() : '';

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

  const id = crypto.randomUUID();
  console.log('CareerNave enquiry received:', { id, name: rawName, email: rawEmail });
  res.status(201).json({ id, received: true });
}

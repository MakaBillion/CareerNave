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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  app.use(express.json({ limit: '64kb' }));

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

import express from "express";
import axios from "axios";
import { MongoClient } from "mongodb";
import { parse, parseISO, isValid, format, subDays } from "date-fns";

const app = express();
app.use(express.json());

// ---- config via env with defaults
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expenses_db";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

// ---- db
const client = new MongoClient(MONGO_URI);
let expenses;

// ---- helpers
function normalizeDate(input) {
  const s = String(input || "").trim().toLowerCase();
  if (!s) throw new Error("date missing");
  if (s === "today") return format(new Date(), "yyyy-MM-dd");
  if (s === "yesterday") return format(subDays(new Date(), 1), "yyyy-MM-dd");
  const iso = parseISO(s); if (isValid(iso)) return format(iso, "yyyy-MM-dd");
  const dmy = parse(s, "dd-MM-yyyy", new Date()); if (isValid(dmy)) return format(dmy, "yyyy-MM-dd");
  const ymdSlash = parse(s, "yyyy/MM/dd", new Date()); if (isValid(ymdSlash)) return format(ymdSlash, "yyyy-MM-dd");
  const dmySlash = parse(s, "dd/MM/yyyy", new Date()); if (isValid(dmySlash)) return format(dmySlash, "yyyy-MM-dd");
  throw new Error("Invalid date format. Use YYYY-MM-DD (or common variants / today / yesterday).");
}

const SYSTEM_PROMPT = `You are an expense extraction assistant.
Extract JSON with fields:
- amount: number (no currency symbol)
- category: string (lowercase)
- date: ISO-like date (YYYY-MM-DD preferred)
Only output JSON.
Input: "I paid ₹500 for groceries yesterday"
Output: {"amount": 500, "category": "groceries", "date": "yesterday"}`;

async function callOllamaParse(text) {
  const payload = { model: OLLAMA_MODEL, prompt: `${SYSTEM_PROMPT}\n\nInput: "${text}"\nOutput:`, stream: false };
  const { data } = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, payload, { timeout: 120000 });
  const resp = (data.response || "").trim();
  const start = resp.indexOf("{"), end = resp.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`Model did not return JSON: ${resp}`);
  return JSON.parse(resp.slice(start, end + 1));
}

// ---- routes
app.get("/health", async (_req, res) => {
  let mongoOk = true, ollamaOk = true;
  try { await client.db().admin().command({ ping: 1 }); } catch { mongoOk = false; }
  try { await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 }); } catch { ollamaOk = false; }
  res.json({ mongo: mongoOk, ollama: ollamaOk, model: OLLAMA_MODEL });
});

app.post("/ingest", async (req, res) => {
  try {
    const text = req.body?.text;
    if (!text) return res.status(400).json({ error: "Missing 'text'" });
    const parsed = await callOllamaParse(text);
    const amount = Number(parsed.amount);
    const category = String(parsed.category || "").toLowerCase().trim();
    const date = normalizeDate(parsed.date);
    if (!Number.isFinite(amount) || !category) throw new Error("Invalid parse results");
    const doc = { amount, category, date, raw: text, created_at: new Date().toISOString() };
    const result = await expenses.insertOne(doc);
    res.status(201).json({ ...doc, _id: String(result.insertedId) });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

app.post("/spending", async (req, res) => {
  try {
    const amount = Number(req.body?.amount);
    const category = String(req.body?.category || "").toLowerCase().trim();
    const date = normalizeDate(String(req.body?.date || ""));
    if (!Number.isFinite(amount) || !category) throw new Error("Invalid payload");
    const doc = { amount, category, date, raw: null, created_at: new Date().toISOString() };
    const result = await expenses.insertOne(doc);
    res.status(201).json({ ...doc, _id: String(result.insertedId) });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

app.get("/spending", async (req, res) => {
  try {
    const { start, end, category } = req.query;
    if (!start || !end) return res.status(400).json({ error: "start and end are required" });
    const startIso = normalizeDate(String(start));
    const endIso = normalizeDate(String(end));
    const match = { date: { $gte: startIso, $lte: endIso } };
    if (category) match.category = String(category).toLowerCase().trim();
    const agg = await expenses.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: "$amount" } } }]).toArray();
    res.json({ start: startIso, end: endIso, category: category ? String(category).toLowerCase().trim() : null, total_spent: agg[0]?.total || 0 });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await client.connect();
    expenses = client.db().collection("expenses");
    console.log(`API on http://0.0.0.0:${PORT}`);
  } catch (e) {
    console.error("Mongo connection failed:", e);
    process.exit(1);
  }
});

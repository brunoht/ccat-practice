const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const TESTS_DIR = path.join(ROOT, "tests");
const ATTEMPTS_DIR = path.join(ROOT, "attempts");
const PUBLIC_DIR = path.join(ROOT, "public");

const VALID_AREAS = new Set(["verbal", "numerical", "spatial", "logic"]);

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(PUBLIC_DIR));

function isSafeJsonFilename(name) {
  return typeof name === "string" && /^[a-zA-Z0-9._-]+\.json$/.test(name);
}

function validateTest(data) {
  if (!data || typeof data !== "object") {
    return "Test must be a JSON object";
  }
  if (typeof data.id !== "string" || !data.id.trim()) {
    return "Test requires a non-empty string id";
  }
  if (typeof data.title !== "string" || !data.title.trim()) {
    return "Test requires a non-empty string title";
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    return "Test requires a non-empty questions array";
  }

  for (let i = 0; i < data.questions.length; i += 1) {
    const q = data.questions[i];
    const label = `questions[${i}]`;
    if (!q || typeof q !== "object") {
      return `${label} must be an object`;
    }
    if (typeof q.id !== "string" || !q.id.trim()) {
      return `${label}.id must be a non-empty string`;
    }
    if (!VALID_AREAS.has(q.area)) {
      return `${label}.area must be one of: verbal, numerical, spatial, logic`;
    }
    if (typeof q.stem !== "string" || !q.stem.trim()) {
      return `${label}.stem must be a non-empty string`;
    }
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      return `${label}.choices must be an array with at least 2 items`;
    }
    if (!q.choices.every((c) => typeof c === "string" && c.trim())) {
      return `${label}.choices must be non-empty strings`;
    }
    if (
      typeof q.answerIndex !== "number" ||
      !Number.isInteger(q.answerIndex) ||
      q.answerIndex < 0 ||
      q.answerIndex >= q.choices.length
    ) {
      return `${label}.answerIndex must be a valid index into choices`;
    }
  }

  return null;
}

async function ensureDirs() {
  await fs.mkdir(TESTS_DIR, { recursive: true });
  await fs.mkdir(ATTEMPTS_DIR, { recursive: true });
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function attemptFilename(date = new Date()) {
  const stamp = [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
    "-",
    pad2(date.getHours()),
    pad2(date.getMinutes()),
    pad2(date.getSeconds()),
  ].join("");
  return `attempt-${stamp}.json`;
}

app.get("/api/tests", async (_req, res) => {
  try {
    await ensureDirs();
    const entries = await fs.readdir(TESTS_DIR, { withFileTypes: true });
    const tests = [];

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) {
        continue;
      }
      if (!isSafeJsonFilename(entry.name)) {
        continue;
      }

      try {
        const raw = await fs.readFile(path.join(TESTS_DIR, entry.name), "utf8");
        const data = JSON.parse(raw);
        const error = validateTest(data);
        if (error) {
          continue;
        }
        tests.push({
          filename: entry.name,
          id: data.id,
          title: data.title,
          questionCount: data.questions.length,
        });
      } catch {
        // Skip unreadable or invalid JSON files
      }
    }

    tests.sort((a, b) => a.filename.localeCompare(b.filename));
    res.json({ tests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list tests" });
  }
});

app.get("/api/tests/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    if (!isSafeJsonFilename(filename)) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const filePath = path.join(TESTS_DIR, filename);
    let raw;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch (err) {
      if (err && err.code === "ENOENT") {
        return res.status(404).json({ error: "Test not found" });
      }
      throw err;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(400).json({ error: "Test file is not valid JSON" });
    }

    const error = validateTest(data);
    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ filename, test: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load test" });
  }
});

app.post("/api/attempts", async (req, res) => {
  try {
    await ensureDirs();
    const attempt = req.body;
    if (!attempt || typeof attempt !== "object" || Array.isArray(attempt)) {
      return res.status(400).json({ error: "Attempt body must be a JSON object" });
    }
    if (!Array.isArray(attempt.items) || attempt.items.length === 0) {
      return res.status(400).json({ error: "Attempt requires a non-empty items array" });
    }

    const filename = attemptFilename();
    const filePath = path.join(ATTEMPTS_DIR, filename);
    const payload = {
      ...attempt,
      savedAt: new Date().toISOString(),
      filename,
    };

    await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    res.status(201).json({ filename, path: `attempts/${filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save attempt" });
  }
});

async function start() {
  await ensureDirs();
  app.listen(PORT, () => {
    console.log(`CCAT simulator listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

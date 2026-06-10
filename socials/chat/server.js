const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "messages.json");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Maak db aan als die niet bestaat
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

function readMessages() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeMessages(msgs) {
  fs.writeFileSync(DB_FILE, JSON.stringify(msgs, null, 2));
}

// Haal alle berichten op
app.get("/messages", (req, res) => {
  const msgs = readMessages();
  res.json(msgs);
});

// Stuur een nieuw bericht
app.post("/messages", (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) return res.status(400).json({ error: "Naam en tekst verplicht" });

  const msgs = readMessages();
  const msg = {
    id: Date.now(),
    name,
    text,
    time: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })
  };
  msgs.push(msg);

  // Bewaar max 500 berichten
  if (msgs.length > 500) msgs.splice(0, msgs.length - 500);

  writeMessages(msgs);
  res.json(msg);
});

app.listen(PORT, () => {
  console.log(`Chatserver draait op http://localhost:${PORT}`);
});

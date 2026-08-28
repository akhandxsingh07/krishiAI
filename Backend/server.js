const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;
const frontendDir = path.join(__dirname, "..", "Frontend");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "KrishiAI"
  });
});

// Keep API routes above the frontend catch-all, then serve the single-page UI
// and its CSS/JS/image assets from ../Frontend.
app.use(express.static(frontendDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`KrishiAI server running on http://localhost:${PORT}`);
});

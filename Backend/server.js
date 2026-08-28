const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "KrishiAI backend is running 🚜"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "KrishiAI"
  });
});

app.listen(PORT, () => {
  console.log(`KrishiAI server running on http://localhost:${PORT}`);
});
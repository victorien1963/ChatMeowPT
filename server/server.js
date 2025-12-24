// server.js
const express = require("express");
const cors = require("cors");
const questions = require("./answers");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 簡單健康檢查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 問答 API
app.post("/api/ask", (req, res) => {
  const { questionId } = req.body;

  if (!questionId || !questions[questionId]) {
    return res.status(400).json({ error: "Unknown questionId" });
  }

  const { question, answer } = questions[questionId];

  // 回傳「問句內容」和「預設回答」
  res.json({
    questionId,
    question,
    answer
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

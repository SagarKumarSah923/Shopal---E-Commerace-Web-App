import express from "express";
import { OpenAI } from "openai";
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  const prompt = `You are a helpful shopping assistant. Help with this query: ${message}`;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Chatbot failed to respond" });
  }
});

export default router;


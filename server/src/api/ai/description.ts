import express from "express";
import { OpenAI } from "openai";
const router = express.Router();

router.post("/generate-description", async (req, res) => {
  const { name, features } = req.body;
  const prompt = `Generate a creative, SEO-friendly product description for: ${name}, features: ${features}`;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ description: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate description" });
  }
});

export default router;
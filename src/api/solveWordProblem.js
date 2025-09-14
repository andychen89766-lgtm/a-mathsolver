import axios from "axios";

let dailyLimit = {}; // simple in-memory per IP limit

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  dailyLimit[ip] = dailyLimit[ip] || 0;

  if (dailyLimit[ip] >= 5) {
    return res.status(429).json({ error: "Daily limit reached" });
  }

  const { problem } = req.body;
  if (!problem) return res.status(400).json({ error: "No problem provided" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "user", content: `Solve this math word problem: ${problem}` }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    dailyLimit[ip]++;
    return res.status(200).json({ answer: response.data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: "Failed to solve problem" });
  }
}
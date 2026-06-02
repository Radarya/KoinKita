import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for GenAI
  app.post("/api/reflect", async (req, res) => {
    try {
      const { amount, note, currentTotalGrams, habit, history } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const historyText = history && history.length > 0 
        ? history.map((tx: any, index: number) => `Log ${index + 1}: ${tx.amount} IDR (${tx.habit}) - "${tx.note}"`).join('\n')
        : "Belum ada histori jurnal sebelumnya.";

      const prompt = `Pengguna baru saja mengonversi Rupiah menjadi emas (Tanam Modal).
Input Terbaru:
Nominal: ${amount}
Habit/Konteks: ${habit}
Catatan: "${note}"
Total emas saat ini: ${currentTotalGrams} gram.

Berikut adalah riwayat beberapa jurnal investasi sebelumnya:
${historyText}

Tugas kamu adalah menganalisis tren dari jurnal pengguna dan menghasilkan dua output:
1. "reflection": 1-2 kalimat pendek yang menenangkan, berbobot, personal, dan sopan tentang keputusan investasi terbarunya ini.
2. "weatherStatus": Cuaca finansial kamu saat ini berdasarkan konsistensi dari histori dan log terbaru. Format harus berupa: "[Ikon Cuaca] [Nama Cuaca] - [Kalimat pendek analisis taktis]". 
Contoh ikon dan cuaca: "☀️ Cerah Berawan", "🌧️ Hujan Lokal", "🌪️ Potensi Badai Impulsif", dll.

Berikan respons dalam format JSON dengan key "reflection" dan "weatherStatus". 
Pastikan JSON valid!`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "Kamu adalah narator dokumenter ala KoinKita. Berikan respons dalam JSON dengan key 'reflection' dan 'weatherStatus'. MAKSIMAL 2-3 KALIMAT PENDEK yang menenangkan, berbobot, personal, dan sopan. Gunakan kata ganti 'kamu' atau kalimat netral. JANGAN gunakan kata informal seperti 'lu' atau 'gue'. Hindari bahasa kaku robotik atau metafora puitis berlebihan. Harus selalu merespon dengan format JSON murni.",
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                "reflection": { type: "string" },
                "weatherStatus": { type: "string" }
              },
              required: ["reflection", "weatherStatus"]
            }
        }
      });
      
      let parsed = { reflection: response.text, weatherStatus: "☀️ Cerah Berawan - Konsistensi mulai terbentuk." };
      try {
         if (response.text) {
             let cleanText = response.text.trim();
             if (cleanText.startsWith("```json")) {
                 cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();
             } else if (cleanText.startsWith("```")) {
                 cleanText = cleanText.replace(/```/g, "").trim();
             }
             parsed = JSON.parse(cleanText);
         }
      } catch (e) {
          // fallback
          console.error("Failed to parse JSON", e, response.text);
      }

      res.json(parsed);
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

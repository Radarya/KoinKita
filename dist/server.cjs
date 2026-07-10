var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.post("/api/reflect", async (req, res) => {
    try {
      const { amount, note, currentTotalGrams, habit, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const historyText = history && history.length > 0 ? history.map((tx, index) => `Log ${index + 1}: ${tx.amount} IDR (${tx.habit}) - "${tx.note}"`).join("\n") : "Belum ada histori jurnal sebelumnya.";
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
Contoh ikon dan cuaca: "\u2600\uFE0F Cerah Berawan", "\u{1F327}\uFE0F Hujan Lokal", "\u{1F32A}\uFE0F Potensi Badai Impulsif", dll.

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
      let parsed = { reflection: response.text, weatherStatus: "\u2600\uFE0F Cerah Berawan - Konsistensi mulai terbentuk." };
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
        console.error("Failed to parse JSON", e, response.text);
      }
      res.json(parsed);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

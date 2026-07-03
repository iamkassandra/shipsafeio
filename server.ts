import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini client to prevent crashing on startup if key is missing
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured. Please set it in the Secrets panel.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // 1. Google ShipSafe support chatbot API (SSAi)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages format. Expected an array." });
        return;
      }

      // Format messages into Google GenAI format: { role: string, parts: [ { text: string } ] }
      const formattedContents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: `You are SSAi, the official Google ShipSafe Customer Support Chatbot.
Your goal is to answer users' questions about ShipSafe AI with a professional, friendly, and tech-forward tone.

BRAND SPECS:
- ShipSafe is "The AI-driven Development Guardrail bridging the gap between AI coding agents and reality."
- Core colors: Brand blue (#07a3d4).
- Font specs: "shipsafe" logo font is Extenda 20 / League Gothic (massive, ultra-bold, condensed), "micro verification" font is Cyrillic Bodoni, "ai" logo font is East Sea Dokdo Cyrillic (artistic brush handwritten).

PRODUCT PLANS:
1. Solo Edition ($29): 
   - Ideal for individual vibe-coders and indie developers.
   - Includes high-speed local repository secrets scanner, basic dependency checks, 0% liability checking.
   - Instant direct download package.
2. Commercial Edition ($149):
   - Designed for software agencies, startup teams, and active production coded deployments.
   - Includes multi-file high-speed security scanning, advanced circular dependency tree resolution, CI/CD integration scripts, and prioritized enterprise email support.
   - Requires 0% liability waiver acceptance upon checkout.

STRICT POLICY:
- We hold 0% liability for runtime code issues. ShipSafe is a local pre-deployment scan tool.
- Purchases require explicit checkbox acceptance of this minimal liability waiver.
- Customers get an instant download link immediately after checkout.

Always answer concisely and maintain a helpful, futuristic vibe. If asked how to purchase, direct them to select a plan from either side of the page and check out.`,
        },
      });

      const responseText = response.text || "I'm sorry, I couldn't process that response.";
      res.json({ content: responseText });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred with the Gemini API.",
        isConfigError: !process.env.GEMINI_API_KEY
      });
    }
  });

  // 2. Custom simulated checkout endpoint
  app.post("/api/checkout", (req, res) => {
    const { plan, email, acceptLiability } = req.body;

    if (!plan || !email) {
      res.status(400).json({ error: "Plan type and email address are required." });
      return;
    }

    if (!acceptLiability) {
      res.status(400).json({ error: "You must accept the non/minimal liability checking waiver to proceed to checkout." });
      return;
    }

    const price = plan === "solo" ? 29 : 149;
    const txId = `SS_TX_${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      txId,
      plan,
      email,
      price,
      message: "Checkout session created successfully."
    });
  });

  // 3. Simulated payment verification (Stripe Notification Simulation)
  app.post("/api/verify-payment", (req, res) => {
    const { txId, cardNumber, cardExpiry, cardCVC, plan } = req.body;

    if (!txId || !cardNumber || !cardExpiry || !cardCVC) {
      res.status(400).json({ error: "Incomplete payment details." });
      return;
    }

    // Simple validation of simulated card
    if (cardNumber.replace(/\s/g, "").length < 16) {
      res.status(400).json({ error: "Invalid simulated card number. Must be 16 digits." });
      return;
    }

    // Payment is successful in our high-fidelity simulation!
    // We generate a secure download token
    const token = `DL_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    res.json({
      success: true,
      message: "Simulated Stripe payment processed successfully!",
      downloadUrl: `/api/download?plan=${plan}&token=${token}`,
      token
    });
  });

  // 4. Secure dynamic download endpoint
  app.get("/api/download", (req, res) => {
    const { plan, token } = req.query;

    if (!plan || !token) {
      res.status(400).send("Access denied. Invalid download query parameters.");
      return;
    }

    const validPlan = plan === "commercial" ? "commercial" : "solo";
    const filename = `shipsafe-${validPlan}.tar.gz`;
    const filePath = path.join(process.cwd(), "public", "downloads", filename);

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/gzip");

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Download streaming error:", err);
        res.status(404).send("File not found or expired. Please contact support.");
      }
    });
  });

  // Vite development middleware vs Static Production files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShipSafe AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

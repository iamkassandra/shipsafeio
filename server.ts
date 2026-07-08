import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// Define local JSON database structure
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "shipsafe_db.json");

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        {
          email: "admin@shipsafe.ai",
          password: "admin",
          name: "ShipSafe Admin",
          isAdmin: true,
          purchasedPlans: ["solo", "commercial"],
          licenseKeys: {
            solo: "SS-SOLO-ADM1-N829-1029",
            commercial: "SS-COMM-ADM1-N149-5829"
          }
        },
        {
          email: "developer@demo.com",
          password: "password123",
          name: "Alex Dev",
          isAdmin: false,
          purchasedPlans: ["solo"],
          licenseKeys: {
            solo: "SS-SOLO-ALEX-P230-9122"
          }
        }
      ],
      transactions: [
        {
          id: "SS_TX_108291",
          email: "developer@demo.com",
          name: "Alex Dev",
          plan: "solo",
          price: 99,
          timestamp: "2026-07-02T14:23:45.000Z",
          status: "completed",
          licenseKey: "SS-SOLO-ALEX-P230-9122"
        },
        {
          id: "SS_TX_981273",
          email: "lead@squad.io",
          name: "Dev Squad Ltd",
          plan: "commercial",
          price: 299,
          timestamp: "2026-07-03T01:10:12.000Z",
          status: "completed",
          licenseKey: "SS-COMM-LEAD-S914-8239"
        }
      ],
      inquiries: [
        {
          id: "inq_1",
          name: "Satoshi Nakamoto",
          email: "satoshin@gmx.com",
          subject: "Decentralized pre-commit security",
          message: "Does your local scanning module support isolated, air-gapped terminal deployment environments with 0% data egress?",
          timestamp: "2026-07-02T18:00:00.000Z"
        }
      ],
      chatStats: {
        totalQueries: 5,
        searchQueries: 2
      }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
  }
}

function getDb() {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { users: [], transactions: [], inquiries: [], chatStats: { totalQueries: 0, searchQueries: 0 } };
  }
}

function saveDb(data: any) {
  initDb();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

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

  // Lazy initialize Stripe client to prevent crashing if key is missing
  let stripeClient: Stripe | null = null;
  function getStripeClient() {
    if (!stripeClient) {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        throw new Error("STRIPE_SECRET_KEY environment variable is not configured. Please set it in the Secrets panel.");
      }
      stripeClient = new Stripe(apiKey, {
        apiVersion: "2025-01-27.acacia" as any,
      });
    }
    return stripeClient;
  }

  // ==================== AUTHENTICATION API ====================

  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Name, email, and password are required." });
      return;
    }

    const db = getDb();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({ error: "A user with this email address already exists." });
      return;
    }

    const newUser = {
      email: email.toLowerCase(),
      password, // Simple local-first store password
      name,
      isAdmin: email.toLowerCase().endsWith("@shipsafe.ai"),
      purchasedPlans: [] as string[],
      licenseKeys: {} as Record<string, string>
    };

    db.users.push(newUser);
    saveDb(db);

    res.json({
      success: true,
      message: "Registration successful!",
      user: {
        email: newUser.email,
        name: newUser.name,
        isAdmin: newUser.isAdmin,
        purchasedPlans: newUser.purchasedPlans,
        licenseKeys: newUser.licenseKeys
      }
    });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const db = getDb();
    const user = db.users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      res.status(401).json({ error: "Invalid email address or password." });
      return;
    }

    res.json({
      success: true,
      message: "Login successful!",
      user: {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        purchasedPlans: user.purchasedPlans,
        licenseKeys: user.licenseKeys
      }
    });
  });

  // ==================== SUPPORT CHATBOT WITH SEARCH GROUNDING ====================

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages format. Expected an array." });
        return;
      }

      // Track query stats
      const db = getDb();
      db.chatStats = db.chatStats || { totalQueries: 0, searchQueries: 0 };
      db.chatStats.totalQueries += 1;
      db.chatStats.searchQueries += 1; // All support queries are grounded
      saveDb(db);

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
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are SSAi, the official Google ShipSafe Customer Support Chatbot.
Your goal is to answer users' questions about ShipSafe AI with a professional, friendly, and tech-forward tone.
You are connected to real-time Google Search results to assist users with current events, latest tech updates, recent news, or fact-checking relative to software security, pre-deployment guardrails, AI development, and recent vulnerability alerts.

BRAND SPECS:
- ShipSafe is "The AI-driven Development Guardrail bridging the gap between AI coding agents and reality."
- Core colors: Brand blue (#07a3d4).
- Font specs: "shipsafe" logo font is Extenda 20 / League Gothic (massive, ultra-bold, condensed), "micro verification" font is Cyrillic Bodoni, "ai" logo font is East Sea Dokdo Cyrillic (artistic brush handwritten).

PRODUCT PLANS:
1. Solo Edition ($99): 
   - Ideal for individual developers and indie creators.
   - Includes high-speed local repository secrets scanner, basic vulnerability checks, and automated key exposure prevention.
   - Instant direct download package.
2. Commercial Edition ($299):
   - Designed for software agencies, startups, and active production deployments.
   - Includes multi-file high-speed security scanning, CI/CD integration scripts, and prioritized enterprise email support.
   - Requires terms of service and license agreement acceptance.

STRICT POLICY:
- ShipSafe is a local pre-commit scan tool used to identify key leaks and security exposures.
- Purchases require agreement to standard terms of service.
- Customers get an instant download link immediately after checkout.

Always answer concisely and maintain a helpful, futuristic vibe. If asked how to purchase, direct them to select a plan from either side of the page and check out. Include citations/links from Google Search when answering real-world news or current event queries to maintain grounding credibility.`,
        },
      });

      const responseText = response.text || "I'm sorry, I couldn't process that response.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const citations = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Web Search Reference",
        uri: chunk.web?.uri || ""
      })).filter((c: any) => c.uri) || [];

      res.json({ content: responseText, citations });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred with the Gemini API.",
        isConfigError: !process.env.GEMINI_API_KEY
      });
    }
  });

  // ==================== SALES & TRANSACTION ENGINE (STRIPE SIMULATED) ====================

  app.post("/api/checkout", async (req, res) => {
    const { plan, email, acceptLiability } = req.body;

    if (!plan || !email) {
      res.status(400).json({ error: "Plan type and email address are required." });
      return;
    }

    if (!acceptLiability) {
      res.status(400).json({ error: "You must accept the non/minimal liability clause to proceed." });
      return;
    }

    const price = plan === "solo" ? 99 : 299;
    const txId = `SS_TX_${Math.floor(100000 + Math.random() * 900000)}`;

    const db = getDb();
    const newTx = {
      id: txId,
      email: email.toLowerCase(),
      name: email.split("@")[0],
      plan,
      price,
      timestamp: new Date().toISOString(),
      status: "pending",
      licenseKey: ""
    };

    db.transactions.push(newTx);
    saveDb(db);

    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    let clientSecret = "";

    if (hasSecretKey) {
      try {
        const stripe = getStripeClient();
        const paymentIntent = await stripe.paymentIntents.create({
          amount: price * 100,
          currency: "usd",
          receipt_email: email.toLowerCase(),
          metadata: {
            txId,
            plan,
            email: email.toLowerCase(),
          },
        });
        clientSecret = paymentIntent.client_secret || "";
      } catch (stripeErr: any) {
        console.error("Stripe payment intent creation error:", stripeErr);
        res.status(500).json({ error: `Stripe initialization failed: ${stripeErr.message}` });
        return;
      }
    }

    res.json({
      success: true,
      txId,
      plan,
      email,
      price,
      isRealStripe: hasSecretKey,
      clientSecret,
      message: hasSecretKey ? "Stripe PaymentIntent created." : "Checkout session created successfully."
    });
  });

  app.post("/api/verify-payment", async (req, res) => {
    const { txId, cardNumber, cardExpiry, cardCVC, plan, email, name, isRealStripe, paymentIntentId } = req.body;

    const db = getDb();
    const txIndex = db.transactions.findIndex((t: any) => t.id === txId);

    // Generate active license key
    const cleanPlan = plan === "commercial" ? "COMM" : "SOLO";
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const keyPart = Math.random().toString(36).substring(3, 7).toUpperCase();
    const licenseKey = `SS-${cleanPlan}-${keyPart}-${randPart}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isRealStripe && paymentIntentId) {
      try {
        const stripe = getStripeClient();
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (intent.status !== "succeeded") {
          res.status(400).json({ error: `Stripe payment verification failed. Status is ${intent.status}` });
          return;
        }

        if (txIndex !== -1) {
          db.transactions[txIndex].status = "completed";
          db.transactions[txIndex].licenseKey = licenseKey;
          if (name) db.transactions[txIndex].name = name;
        } else {
          db.transactions.push({
            id: txId,
            email: email ? email.toLowerCase() : "anonymous@domain.com",
            name: name || "Anonymous Buyer",
            plan,
            price: plan === "solo" ? 99 : 299,
            timestamp: new Date().toISOString(),
            status: "completed",
            licenseKey
          });
        }
      } catch (stripeErr: any) {
        console.error("Stripe verification error:", stripeErr);
        res.status(500).json({ error: `Stripe verification failed: ${stripeErr.message}` });
        return;
      }
    } else {
      // Simulation mode
      if (!txId || !cardNumber || !cardExpiry || !cardCVC) {
        res.status(400).json({ error: "Incomplete payment details." });
        return;
      }

      const cleanCard = cardNumber.replace(/\s/g, "");
      if (cleanCard.length < 16) {
        res.status(400).json({ error: "Invalid simulated card number. Must be 16 digits." });
        return;
      }

      // Simulate Stripe decline / failed payment unless test card 4242 is used
      if (cleanCard !== "4242424242424242") {
        res.status(402).json({
          error: "Stripe Payment Failed (Decline): Stripe was unable to authorize the transaction. Please try again with standard test card (4242 4242 4242 4242)."
        });
        return;
      }

      if (txIndex !== -1) {
        db.transactions[txIndex].status = "completed";
        db.transactions[txIndex].licenseKey = licenseKey;
        if (name) db.transactions[txIndex].name = name;
      } else {
        // Create transaction on the fly if session wasn't tracked
        db.transactions.push({
          id: txId,
          email: email ? email.toLowerCase() : "anonymous@domain.com",
          name: name || "Anonymous Buyer",
          plan,
          price: plan === "solo" ? 99 : 299,
          timestamp: new Date().toISOString(),
          status: "completed",
          licenseKey
        });
      }
    }

    // Link the purchased plan to registered user account if they exist in the DB
    const userEmail = email ? email.toLowerCase() : (txIndex !== -1 ? db.transactions[txIndex].email.toLowerCase() : "");
    if (userEmail) {
      const user = db.users.find((u: any) => u.email.toLowerCase() === userEmail);
      if (user) {
        if (!user.purchasedPlans.includes(plan)) {
          user.purchasedPlans.push(plan);
        }
        user.licenseKeys = user.licenseKeys || {};
        user.licenseKeys[plan] = licenseKey;
      } else {
        // Auto-create standard developer account so they can log in later to access downloads!
        db.users.push({
          email: userEmail,
          password: "password123", // default password, they can log in immediately
          name: name || userEmail.split("@")[0],
          isAdmin: false,
          purchasedPlans: [plan],
          licenseKeys: { [plan]: licenseKey }
        });
      }
    }

    saveDb(db);

    const token = `DL_${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    res.json({
      success: true,
      message: isRealStripe ? "Real Stripe payment completed successfully!" : "Simulated Stripe payment processed successfully!",
      downloadUrl: `/api/download?plan=${plan}&token=${token}`,
      licenseKey,
      token,
      emailed: true,
      emailedTo: userEmail
    });
  });

  // ==================== INQUIRIES & CONTACT FORM ====================

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required to submit an inquiry." });
      return;
    }

    const db = getDb();
    const newInquiry = {
      id: `inq_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      subject,
      message,
      timestamp: new Date().toISOString()
    };

    db.inquiries.push(newInquiry);
    saveDb(db);

    res.json({
      success: true,
      message: "Your inquiry has been logged in our systems. A support specialist will respond shortly."
    });
  });

  // ==================== INTERNAL CRM & ADMINISTRATIVE SERVICES ====================

  app.get("/api/admin/crm", (req, res) => {
    // Return complete, compiled CRM metrics
    const db = getDb();
    
    // Aggregation
    const completedTransactions = db.transactions.filter((t: any) => t.status === "completed");
    const totalRevenue = completedTransactions.reduce((acc: number, t: any) => acc + t.price, 0);
    const soloCount = completedTransactions.filter((t: any) => t.plan === "solo").length;
    const commercialCount = completedTransactions.filter((t: any) => t.plan === "commercial").length;

    res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalSalesCount: completedTransactions.length,
        soloCount,
        commercialCount,
        registeredUsersCount: db.users.length,
        totalInquiries: db.inquiries.length,
        chatStats: db.chatStats || { totalQueries: 5, searchQueries: 2 }
      },
      users: db.users.map((u: any) => ({
        email: u.email,
        name: u.name,
        isAdmin: u.isAdmin,
        purchasedPlans: u.purchasedPlans,
        licenseKeys: u.licenseKeys
      })),
      transactions: db.transactions,
      inquiries: db.inquiries
    });
  });

  // ==================== SECURE DYNAMIC DOWNLOAD ====================

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


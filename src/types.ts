export type PageView = "home" | "solo" | "commercial" | "docs" | "about";

export interface Plan {
  id: "solo" | "commercial";
  name: string;
  price: number;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CheckoutSession {
  txId: string;
  plan: "solo" | "commercial";
  email: string;
  price: number;
}

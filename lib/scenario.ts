export type ScenarioStep = {
  tool: "web_search" | "web_fetch";
  args: string;
  result: string;
};

export type ScenarioSource = {
  title: string;
  url: string;
  excerpt: string;
};

export type Scenario = {
  question: string;
  steps: ScenarioStep[];
  answer: string;
  sources: ScenarioSource[];
  notVerified: string[];
  toolsUsed: string[];
  tokenCost: number;
  confidence: { value: number; ingredients: string[] };
};

export const scenario: Scenario = {
  question: "Is this iPhone 15 listing at €299 a scam?",
  steps: [
    {
      tool: "web_search",
      args: '"iPhone 15" 299€ used listing',
      result: "14 results",
    },
    {
      tool: "web_fetch",
      args: "subito.example/listing/88213",
      result: "page read",
    },
    {
      tool: "web_search",
      args: "average used iPhone 15 price",
      result: "comparison complete",
    },
  ],
  answer:
    "Yes — this listing shows three strong scam signals. The price of €299 is roughly 40% below the average market price for a used iPhone 15 (about €510), which is the most common lure in marketplace fraud. The seller account was created only 3 days ago, and the listing accepts PostePay top-up payment only, a method with no buyer protection. I would not proceed with this purchase.",
  sources: [
    {
      title: "iPhone 15, 128GB — €299",
      url: "https://subito.example/listing/88213",
      excerpt:
        "iPhone 15 like new, €299. Payment only via PostePay top-up. No meet-up, no other payment methods. Contact fast, first come first served.",
    },
    {
      title: "Used iPhone 15 price index — September 2026",
      url: "https://priceindex.example/iphone-15",
      excerpt:
        "Average used price: €512. Listings priced more than 35% below average show an 11× higher fraud-report rate.",
    },
    {
      title: "Marketplace safety: payment methods",
      url: "https://safety.example/postepay-scams",
      excerpt:
        "PostePay top-ups are irreversible and offer no buyer protection. They are requested in 68% of reported electronics scams.",
    },
  ],
  notVerified: [
    "The seller's real identity",
    "Account history beyond the last 3 days",
    "Whether this listing has already been reported by other users",
  ],
  toolsUsed: ["web_search", "web_fetch"],
  tokenCost: 1900,
  confidence: {
    value: 82,
    ingredients: [
      "3 concordant sources",
      "0 contradictions",
      "no primary source for seller identity",
    ],
  },
};

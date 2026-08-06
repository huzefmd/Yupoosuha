import stockImg from "@/assets/topic-stock.jpg";
import creditCardImg from "@/assets/topic-credit-card.jpg";
import insuranceImg from "@/assets/topic-insurance.jpg";
import financeImg from "@/assets/topic-finance.jpg";

export type NextStep = {
  label: string;
  description: string;
  to: "/insurance" | "/finance" | "/free-learning" | "/shopping";
};

export type LearnTopic = {
  slug: string;
  name: string;
  image: string;
  tagline: string;
  intro: string;
  sections: { heading: string; body: string; points?: string[] }[];
  nextSteps: NextStep[];
};

const buyInsurance: NextStep = {
  label: "Buy insurance",
  description: "Compare term, health and general cover and pick a policy.",
  to: "/insurance",
};
const buyFinance: NextStep = {
  label: "Open a demat / finance account",
  description: "Free demat accounts, home loans and other financial services.",
  to: "/finance",
};
const keepLearning: NextStep = {
  label: "Keep learning for free",
  description: "Watch more free videos on markets and money habits.",
  to: "/free-learning",
};

export const learnTopics: LearnTopic[] = [
  {
    slug: "stock",
    name: "Stock Market",
    image: stockImg,
    tagline: "How shares, indices and long-term investing actually work.",
    intro:
      "A share is a small piece of ownership in a business. When the business grows, your slice becomes more valuable. That is the whole idea behind stock market investing — the rest is detail, discipline and time.",
    sections: [
      {
        heading: "1. The basics",
        body: "Companies raise money by selling shares. Exchanges match buyers and sellers, and an index like the Nifty 50 or Sensex simply tracks a basket of large companies so you can see how the market as a whole is doing.",
        points: [
          "Share price = what the last buyer and seller agreed on, not the company's true worth",
          "Indices are a thermometer for the market, not a stock you must pick",
          "You need a demat + trading account to hold shares",
        ],
      },
      {
        heading: "2. How people actually make money",
        body: "Two ways: the price of your share rises (capital gains) or the company shares its profits with you (dividends). Both reward patience far more than activity.",
        points: [
          "Time in the market beats timing the market",
          "SIPs into index funds are the simplest starting point",
          "Reinvested dividends quietly compound over decades",
        ],
      },
      {
        heading: "3. Risk, in plain words",
        body: "Prices fall — sometimes 30% or more — and that is normal. The real risk is being forced to sell at the bottom. Keep 6 months of expenses in cash, and only invest money you will not need for at least 5 years.",
        points: [
          "Diversify across companies and sectors",
          "Avoid leverage and 'sure-shot' tips",
          "Write down why you bought — review it, not the daily price",
        ],
      },
    ],
    nextSteps: [buyFinance, keepLearning, buyInsurance],
  },
  {
    slug: "credit-card",
    name: "Credit Cards",
    image: creditCardImg,
    tagline: "Use the bank's money for free — or pay 40% a year. Your choice.",
    intro:
      "A credit card is a short-term, interest-free loan if you pay the full statement amount on time. Miss that, and it becomes one of the most expensive loans you can take.",
    sections: [
      {
        heading: "1. The billing cycle",
        body: "You spend during a cycle, get a statement, then have roughly 15-20 days to pay. Pay the total due — not the 'minimum due' — and you pay zero interest.",
        points: [
          "Minimum due keeps the account healthy, not your wallet",
          "Interest on carried balances runs ~36-45% per year",
          "Cash withdrawals on a card charge interest from day one",
        ],
      },
      {
        heading: "2. Rewards without the trap",
        body: "Cashback, points and lounge access are only profitable if you would have spent that money anyway. Pick a card that matches your real spending, not the flashiest one.",
        points: [
          "Check annual fee vs. what you realistically earn back",
          "Fuel, groceries and travel cards suit different lives",
          "Never spend extra to 'unlock' a reward",
        ],
      },
      {
        heading: "3. Your credit score",
        body: "On-time payments and low utilisation build a score that later gets you cheaper home and car loans. Keep usage under 30% of your limit and never miss a due date.",
        points: [
          "Set an auto-debit for the full statement amount",
          "Keep your oldest card open — history matters",
          "Check your credit report once a year for errors",
        ],
      },
    ],
    nextSteps: [buyFinance, keepLearning, buyInsurance],
  },
  {
    slug: "insurance",
    name: "Insurance",
    image: insuranceImg,
    tagline: "Protection first. Investing only makes sense after you're covered.",
    intro:
      "Insurance is not an investment. It is a way to transfer a loss you cannot afford — a hospital bill, a lost income — to someone who can. Buy it for the cover, never for the returns.",
    sections: [
      {
        heading: "1. Term life",
        body: "Pure life cover: you pay a small premium, and if you die during the term your family receives a large sum. It is the cheapest and most honest form of life insurance.",
        points: [
          "Aim for 10-15x your annual income",
          "Buy young — premiums lock in low",
          "Disclose health history honestly or claims get rejected",
        ],
      },
      {
        heading: "2. Health insurance",
        body: "Medical costs rise faster than salaries. A family floater plan covers hospitalisation for everyone under one sum insured, and a super top-up cheaply extends it.",
        points: [
          "Check room-rent limits and waiting periods",
          "Prefer insurers with high claim-settlement ratios",
          "Employer cover alone is not enough — it ends with the job",
        ],
      },
      {
        heading: "3. General cover",
        body: "Motor, home, travel and personal accident policies handle the everyday risks. Read what is excluded before you read what is promised.",
        points: [
          "Never mix insurance with investment (avoid ULIP-style plans)",
          "Review cover after marriage, a child or a loan",
          "Keep nominee details updated",
        ],
      },
    ],
    nextSteps: [buyInsurance, buyFinance, keepLearning],
  },
  {
    slug: "finance",
    name: "Personal Finance",
    image: financeImg,
    tagline: "Budget, emergency fund, debt, then investing — in that order.",
    intro:
      "Personal finance is a sequence, not a secret. Get the order right and the rest becomes routine: know your cash flow, build a buffer, kill costly debt, then let compounding work.",
    sections: [
      {
        heading: "1. Budget and cash flow",
        body: "Track a full month of spending once. Most people find 10-20% they did not know they were losing. A simple 50/30/20 split — needs, wants, savings — is enough structure to start.",
        points: [
          "Automate savings on salary day, not month-end",
          "Separate accounts for spending and saving",
          "Review subscriptions quarterly",
        ],
      },
      {
        heading: "2. Emergency fund and debt",
        body: "Keep 6 months of expenses in a savings account or liquid fund before investing. Then clear anything charging more than ~12% interest — credit cards and personal loans first.",
        points: [
          "Highest-interest debt first (avalanche method)",
          "Never invest with borrowed money",
          "A home loan is the one 'good' debt, within limits",
        ],
      },
      {
        heading: "3. Growing your money",
        body: "Open a demat account, start a monthly SIP, and increase it whenever your income rises. Boring, automatic and consistent beats clever almost every time.",
        points: [
          "Match the instrument to the goal's time horizon",
          "Use tax-saving options you actually understand",
          "Rebalance once a year, then leave it alone",
        ],
      },
    ],
    nextSteps: [buyFinance, buyInsurance, keepLearning],
  },
];

export function getLearnTopic(slug: string) {
  return learnTopics.find((t) => t.slug === slug);
}

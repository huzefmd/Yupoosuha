import { createServerFn } from "@tanstack/react-start";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAvailableSymbols, getMarketIndices } from "./indices.functions";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type ChatMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

export const chatWithAI = createServerFn({ method: "POST" })
  .validator((data: { message: string; history: ChatMessage[] }) => data)
  .handler(async ({ data }) => {
    const { message, history } = data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    try {
      // 1. Market Data Integration
      const symbols = await getAvailableSymbols();
      const foundSymbol = symbols.find(s =>
        message.toUpperCase().includes(s.toUpperCase())
      );

      let marketContext = "";
      if (foundSymbol) {
        const marketData = await getMarketIndices();
        const quote = marketData.quotes.find(q => q.name === foundSymbol);
        if (quote) {
            marketContext = `\n\nREAL-TIME MARKET DATA:\nSymbol: ${quote.name}\nPrice: ${quote.last}\nChange: ${quote.change}\nPercent Change: ${quote.percentChange}%\nSource: ${quote.source}\nUpdated: ${quote.updatedAt}`;
        }
      }

      // 2. Initialize Model
      const model = genAI.getGenerativeModel({
        model: "gemini-3.8-flash",
        systemInstruction: `You are a professional financial assistant for Yupoosuha, a finance education and stock market website.
        Your goal is to help users understand the stock market and provide current data when available.

        GUIDELINES:
        - Use the provided REAL-TIME MARKET DATA if present. If not, do not invent prices.
        - Explain financial concepts in beginner-friendly language.
        - If a stock is not supported, suggest NIFTY 50, SENSEX, or RELIANCE.
        - Always include a brief financial disclaimer: "Disclaimer: This is for educational purposes only and not financial advice."
        - Keep responses concise, professional, and readable.
        - Never claim to place trades or guarantee returns.`
      });

      // 3. Start Chat Session
      const chatSession = model.startChat({
        history: history,
      });

      const prompt = marketContext
        ? `${message}\n${marketContext}`
        : message;

      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;

      return {
        text: response.text(),
      };
    } catch (error: any) {
      console.error("Chat API Error:", error);
      throw new Error(error.message || "An error occurred while processing your request.");
    }
  });

import { createServerFn } from "@tanstack/react-start";

export type NewsArticle = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
  symbol?: string;
};

const FETCH_TIMEOUT = 8000;

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const getTrendingNews = createServerFn({ method: "GET" })
  .validator((data: { category?: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error("FINNHUB_API_KEY is missing from server environment");
    }

    const category = data?.category || "general";
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;

    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`);
      }
      const news = (await res.json()) as NewsArticle[];
      return news.slice(0, 12);
    } catch (error: any) {
      console.error("Error in getTrendingNews:", error);
      throw new Error(error.message || "Failed to fetch trending news");
    }
  });

export const getStockNews = createServerFn({ method: "GET" })
  .validator((data: { symbol: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error("FINNHUB_API_KEY is missing from server environment");
    }

    if (!data?.symbol) {
      return [];
    }

    const to = new Date().toISOString().split("T")[0];
    // Increased from 7 days to 30 days to ensure we find news
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const url = `https://finnhub.io/api/v1/company-news?symbol=${data.symbol}&from=${from}&to=${to}&token=${apiKey}`;

    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`);
      }
      const news = (await res.json()) as NewsArticle[];
      return news.slice(0, 5); // Get a few articles per stock
    } catch (error: any) {
      console.error(`Error fetching news for ${data?.symbol}:`, error);
      return []; // Return empty array instead of crashing for a single stock
    }
  });

import { createServerFn } from "@tanstack/react-start";
import { XMLParser } from "fast-xml-parser";

export type NewsArticle = {
  category: string;
  datetime: number;
  headline: string;
  id: number | string;
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

// ---------------------------------------------------------------------------
// RSS feeds from news channels (free, no API key)
// ---------------------------------------------------------------------------

const FEEDS = [
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
  { source: "Moneycontrol", url: "https://www.moneycontrol.com/rss/latestnews.xml" },
  { source: "Livemint", url: "https://www.livemint.com/rss/markets" },
  { source: "CNBC", url: "https://www.cnbc.com/id/10001147/device/rss/rss.html" },
  { source: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
];

const xmlParser = new XMLParser({ ignoreAttributes: false });

// Simple in-memory cache so every visitor doesn't hit the publishers' feeds
let cache: { at: number; data: NewsArticle[] } | null = null;
const CACHE_MS = 3 * 60 * 1000;

async function fetchAllFeeds(): Promise<NewsArticle[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data;

  const results = await Promise.allSettled(
    FEEDS.map(async ({ source, url }) => {
      const res = await fetchWithTimeout(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) throw new Error(`${source}: ${res.status}`);
      const xml = await res.text();
      const raw = xmlParser.parse(xml)?.rss?.channel?.item ?? [];
      const items = Array.isArray(raw) ? raw : [raw];

      return items.map(
        (i: any): NewsArticle => ({
          id: String(i.guid?.["#text"] ?? i.guid ?? i.link),
          headline: String(i.title ?? ""),
          summary: String(i.description ?? "")
            .replace(/<[^>]+>/g, "")
            .trim()
            .slice(0, 200),
          url: String(i.link ?? ""),
          source,
          datetime: Math.floor(new Date(i.pubDate).getTime() / 1000) || 0,
          image: i["media:content"]?.["@_url"] ?? i.enclosure?.["@_url"] ?? "",
          category: "general",
          related: "",
        }),
      );
    }),
  );

  const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // Remove duplicate links, newest first
  const seen = new Set<string>();
  const data = all
    .filter((a) => a.url && !seen.has(a.url) && seen.add(a.url))
    .sort((a, b) => b.datetime - a.datetime)
    .slice(0, 30);

  if (data.length > 0) cache = { at: Date.now(), data };
  return data;
}

export const getAllNews = createServerFn({ method: "GET" }).handler(async () => {
  return await fetchAllFeeds();
});
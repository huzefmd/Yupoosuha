import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Newspaper, TrendingUp, Globe, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrendingNews, getStockNews, type NewsArticle } from "@/lib/news.functions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/lib/language-context";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Category = "all" | "market" | "stocks";

const CATEGORIES: { labelKey: string; value: Category; icon: React.ReactNode }[] = [
  { labelKey: "trending.stocks", value: "stocks", icon: <Briefcase className="w-4 h-4" /> },
];

const INDIAN_STOCK_SYMBOLS = [
  "RELIANCE.NS",
  "HDFCBANK.NS",
  "INFY.NS",
  "TCS.NS",
  "ICICIBANK.NS",
  "SBIN.NS",
  "BHARTIARTL.NS",
  "ITC.NS",
];

export default function TrendingNow() {
  const { language, setLanguage, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("stocks");

  const {
    data: news,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trending-news", activeCategory],
    queryFn: async () => {
      try {
        // Fetch stock-specific news for the symbols
        const stockNewsPromises = INDIAN_STOCK_SYMBOLS.map((symbol) =>
          getStockNews({ symbol }).then((res) => res.map((art) => ({ ...art, symbol }))),
        );
        const stockNewsResults = await Promise.all(stockNewsPromises);
        const flattenedStockNews = stockNewsResults.flat();

        if (flattenedStockNews.length > 0) {
          return flattenedStockNews.sort((a, b) => b.datetime - a.datetime);
        }

        // Fallback to general market news if no stock-specific news is found
        return await getTrendingNews({ category: "general" });
      } catch (e: any) {
        throw e;
      }
    },
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(language, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("trending.title")}</h2>
            <p className="text-muted-foreground">{t("trending.subtitle")}</p>
          </div>
        </div>

        <div className="flex p-0.5 bg-muted rounded-md w-fit">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={activeCategory === cat.value ? "default" : "ghost"}
              size="sm"
              className={cn(
                "gap-1 px-2 py-0.5 text-[11px] h-6 transition-all",
                activeCategory === cat.value ? "shadow-sm" : "",
              )}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.icon}
              {t(cat.labelKey)}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-md bg-card">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-muted/50 rounded-2xl border-2 border-dashed">
          <p className="text-muted-foreground mb-4">{t("trending.error_title")}</p>
          <Button variant="outline" onClick={() => (window as any).location.reload()}>
            {t("trending.error_retry")}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news && news.length > 0 ? (
            news.slice(0, 6).map((article) => (
              <Card
                key={article.id}
                className="group overflow-hidden border-none shadow-md bg-card hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      article.image ||
                      "https://images.unsplash.com/photo-1611974717482-98257667755b?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={article.headline}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1611974717482-98257667755b?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  {(article.related || article.symbol) && (
                    <Badge className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm border-none text-white">
                      {article.symbol || article.related}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">{article.source}</span>
                    <span>•</span>
                    <span>{formatTime(article.datetime)}</span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group/link"
                  >
                    <h3 className="text-lg font-semibold leading-tight mb-3 group-hover/link:text-blue-600 transition-colors line-clamp-2">
                      {article.headline}
                    </h3>
                  </a>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn"
                    >
                      {t("trending.read_article")}
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-muted/50 rounded-2xl border-2 border-dashed">
              <p className="text-muted-foreground">{t("trending.error_empty")}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

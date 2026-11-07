import { useQuery } from "@tanstack/react-query";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllNews } from "@/lib/news.functions";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1611974717482-98257667755b?q=80&w=800&auto=format&fit=crop";

export default function TrendingNow() {
  const {
    data: news,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trending-news"],
    queryFn: () => getAllNews(),
    refetchInterval: 5 * 60 * 1000, // refresh every 5 minutes
    staleTime: 2 * 60 * 1000,
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
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
            <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
            <p className="text-muted-foreground">
              Latest updates from the market
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden border-none shadow-md bg-card"
            >
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
          <p className="text-muted-foreground mb-4">
            Oops! Something went wrong
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
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
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={article.image || FALLBACK_IMAGE}
                    alt={article.headline}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                  <Badge className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm border-none text-white">
                    {article.source}
                  </Badge>
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">
                      {article.source}
                    </span>
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
                      Read Article
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-muted/50 rounded-2xl border-2 border-dashed">
              <p className="text-muted-foreground">
                No trending news available right now
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
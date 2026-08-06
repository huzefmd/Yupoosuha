import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Video = Tables<"free_learning_videos">;
export type Deal = Tables<"shopping_deals">;
export type Insurance = Tables<"insurance_types">;
export type FinanceOffer = Tables<"finance_offers">;

async function fetchTable(table: string) {
  const { data, error } = await supabase
    .from(table as never)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function useContent<T>(table: string) {
  return useQuery({
    queryKey: [table],
    queryFn: () => fetchTable(table) as Promise<T[]>,
  });
}

export function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${u.pathname}`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    if (u.pathname.startsWith("/embed/")) return url;
    return null;
  } catch {
    return null;
  }
}

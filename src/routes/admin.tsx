import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/lib/content";
import { useIsAdmin } from "@/lib/session";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Yupoosuha" },
      { name: "description", content: "Manage Yupoosuha learning, shopping, insurance and finance content." },
      { property: "og:title", content: "Admin Dashboard | Yupoosuha" },
      { property: "og:description", content: "Manage Yupoosuha content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

type FieldType = "text" | "textarea" | "list";
type Field = { key: string; label: string; type: FieldType; required?: boolean };

const sections: { table: string; label: string; fields: Field[] }[] = [
  {
    table: "free_learning_videos",
    label: "Free Learning",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "video_url", label: "Video URL (YouTube or direct link)", type: "text", required: true },
      { key: "thumbnail_url", label: "Thumbnail image URL", type: "text" },
    ],
  },
  {
    table: "shopping_deals",
    label: "Shopping",
    fields: [
      { key: "title", label: "Product name", type: "text", required: true },
      { key: "image_url", label: "Product image URL", type: "text" },
      { key: "price", label: "Price", type: "text" },
      { key: "discount", label: "Discount", type: "text" },
      { key: "link", label: "Shop Now link", type: "text", required: true },
    ],
  },
  {
    table: "insurance_types",
    label: "Insurance",
    fields: [
      { key: "title", label: "Insurance type", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image URL", type: "text" },
      { key: "link", label: "External link", type: "text" },
    ],
  },
  {
    table: "finance_offers",
    label: "Finance",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "image_url", label: "Image URL", type: "text" },
      { key: "highlights", label: "Key highlights (one per line)", type: "list" },
      { key: "link", label: "External action link", type: "text" },
    ],
  },
  {
    table: "jobs",
    label: "Jobs",
    fields: [
      { key: "title", label: "Job title", type: "text", required: true },
      { key: "company", label: "Company", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "job_type", label: "Job type (Freelance, Full-time…)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image URL", type: "text" },
      { key: "link", label: "Apply link", type: "text" },
    ],
  },
  {
    table: "learn_links",
    label: "Lesson links",
    fields: [
      {
        key: "topic",
        label: "Lesson (stock, credit-card, insurance or finance)",
        type: "text",
        required: true,
      },
      { key: "label", label: "Link title", type: "text", required: true },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "url", label: "Link URL (https://…)", type: "text", required: true },
    ],
  },
];


function Admin() {
  const { isAdmin, loading, user } = useIsAdmin();

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-muted-foreground sm:px-6">Loading…</div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl font-bold">Admin access only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user
              ? "This account doesn't have admin rights on Yupoosuha."
              : "Sign in with the admin email to manage content."}
          </p>
          <Button asChild className="mt-6">
            <Link to={user ? "/" : "/auth"}>{user ? "Back to home" : "Sign in"}</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Admin"
        title="Content dashboard"
        subtitle="Add, edit and remove everything shown on the public pages. Changes go live immediately."
      />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Tabs defaultValue={sections[0]!.table}>
          <TabsList className="flex-wrap">
            {sections.map((s) => (
              <TabsTrigger key={s.table} value={s.table}>
                {s.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="contact_messages">Messages</TabsTrigger>
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.table} value={s.table} className="mt-6">
              <CrudSection table={s.table} fields={s.fields} />
            </TabsContent>
          ))}
          <TabsContent value="contact_messages" className="mt-6">
            <Messages />
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}

type Row = Record<string, unknown> & { id: string };

function CrudSection({ table, fields }: { table: string; fields: Field[] }) {
  const { data, isLoading } = useContent<Row>(table);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (editing) {
        const { error } = await supabase
          .from(table as never)
          .update(values as never)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(values as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      setOpen(false);
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = String(fd.get(f.key) ?? "").trim();
      if (f.required && !raw) {
        toast.error(`${f.label} is required`);
        return;
      }
      if (f.type === "list") {
        values[f.key] = raw ? raw.split("\n").map((l) => l.trim()).filter(Boolean) : [];
      } else {
        values[f.key] = raw || (f.required ? raw : null);
      }
    }
    save.mutate(values);
  };

  const initial = (f: Field) => {
    const v = editing?.[f.key];
    if (f.type === "list") return Array.isArray(v) ? v.join("\n") : "";
    return v == null ? "" : String(v);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${data?.length ?? 0} item(s)`}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add new
        </Button>
      </div>

      {open && (
        <form
          onSubmit={submit}
          key={editing?.id ?? "new"}
          className="mt-5 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <h3 className="font-semibold">{editing ? "Edit entry" : "New entry"}</h3>
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={`${table}-${f.key}`}>{f.label}</Label>
              {f.type === "text" ? (
                <Input id={`${table}-${f.key}`} name={f.key} defaultValue={initial(f)} maxLength={500} />
              ) : (
                <Textarea
                  id={`${table}-${f.key}`}
                  name={f.key}
                  rows={f.type === "list" ? 4 : 3}
                  defaultValue={initial(f)}
                  maxLength={2000}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <ul className="mt-6 space-y-3">
        {data?.map((row) => (
          <li
            key={row.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
          >
            <span className="truncate text-sm font-medium">
              {String(row["title"] ?? row["label"] ?? "Untitled")}
              {row["topic"] ? ` · ${String(row["topic"])}` : ""}
            </span>

            <span className="flex shrink-0 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(row);
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => remove.mutate(row.id)}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Messages() {
  const { data, isLoading } = useContent<Row>("contact_messages");
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data?.length) return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  return (
    <ul className="space-y-3">
      {data.map((m) => (
        <li key={m.id} className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">
            {String(m["name"])} · {String(m["email"])}
            {m["phone"] ? ` · ${String(m["phone"])}` : ""}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {String(m["message"])}
          </p>
        </li>
      ))}
    </ul>
  );
}

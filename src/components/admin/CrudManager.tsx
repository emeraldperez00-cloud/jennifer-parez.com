import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Save } from "lucide-react";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url";
  placeholder?: string;
};

export function CrudManager<T extends { id: string } = { id: string } & Record<string, unknown>>({
  table,
  fields,
  defaults,
  orderBy = "sort_order",
  title,
}: {
  table: "offers" | "social_links" | "testimonials" | "content_previews";
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  orderBy?: string;
  title: string;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from(table).select("*").order(orderBy);
    setRows(((data ?? []) as unknown) as T[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const updateRow = (id: string, key: string, value: unknown) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  };

  const saveRow = async (row: T) => {
    setBusy(true);
    const { id, ...rest } = row;
    const { error } = await supabase.from(table).update(rest as never).eq("id", id);
    setBusy(false);
    setMsg(error ? error.message : "Saved ✓");
    setTimeout(() => setMsg(null), 2000);
  };

  const addRow = async () => {
    setBusy(true);
    const { error } = await supabase.from(table).insert(defaults as never);
    setBusy(false);
    if (error) setMsg(error.message);
    else load();
  };

  const removeRow = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from(table).delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{title}</h3>
        <button onClick={addRow} className="btn-ghost-luxe rounded-full px-4 py-2 text-sm text-gold inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {msg && <p className="text-sm text-gold">{msg}</p>}

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-[10px] uppercase tracking-widest text-gold/80 mb-1 block">
                    {f.label}
                  </span>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={((row as Record<string, unknown>)[f.key] as string) ?? ""}
                      onChange={(e) => updateRow(row.id, f.key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-gold/60 focus:outline-none text-sm"
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      placeholder={f.placeholder}
                      value={((row as Record<string, unknown>)[f.key] as string | number) ?? ""}
                      onChange={(e) =>
                        updateRow(
                          row.id,
                          f.key,
                          f.type === "number" ? Number(e.target.value) : e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-gold/60 focus:outline-none text-sm"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => removeRow(row.id)}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => saveRow(row)}
                disabled={busy}
                className="btn-luxe rounded-full px-4 py-2 text-sm inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No items yet. Click "Add" to create one.
          </p>
        )}
      </div>
    </div>
  );
}
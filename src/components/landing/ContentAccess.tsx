import { motion } from "framer-motion";
import { Lock, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export function ContentAccess({
  items,
}: {
  items: Tables<"content_previews">[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">
            Exclusive Vault
          </p>
          <h2 className="text-3xl sm:text-5xl font-display">
            Locked <span className="text-gradient-gold">premium content</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">
            A glimpse of what's waiting inside.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden glass-card glass-card-hover"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: c.thumbnail_url
                    ? `url(${c.thumbnail_url}) center/cover`
                    : "var(--gradient-luxe)",
                  filter: "blur(8px) saturate(1.2)",
                  transform: "scale(1.1)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />

              <div className="relative h-full flex flex-col justify-between p-4">
                {c.badge && (
                  <span className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur border border-border text-[10px] uppercase tracking-widest text-gold">
                    <Lock className="w-3 h-3" />
                    {c.badge}
                  </span>
                )}

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-background/60 backdrop-blur-xl border border-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Eye className="w-5 h-5 text-gold" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base sm:text-lg leading-tight">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-xs text-gold font-medium border-b border-gold/40 pb-px">
                    {c.cta_label} →
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import {
  Crown,
  Sparkles,
  Users,
  Camera,
  Gem,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const ICONS: Record<string, LucideIcon> = {
  crown: Crown,
  sparkles: Sparkles,
  users: Users,
  camera: Camera,
  gem: Gem,
};

export function OffersSection({ offers }: { offers: Tables<"offers">[] }) {
  if (offers.length === 0) return null;
  return (
    <section id="offers" className="px-4 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">
            Premium Offers
          </p>
          <h2 className="text-3xl sm:text-5xl font-display">
            Step inside the <span className="text-gradient-gold">inner circle</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {offers.map((o, i) => {
            const Icon = ICONS[o.icon] ?? Crown;
            return (
              <motion.a
                key={o.id}
                href={o.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="glass-card glass-card-hover rounded-2xl p-6 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_8px_30px_-8px_oklch(0.82_0.14_85/0.6)]">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{o.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {o.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-gold border-t border-border pt-4">
                  {o.cta_label}
                  <ArrowUpRight className="ml-1 w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, Heart, Users, TrendingUp } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export function SocialProof({
  profile,
  testimonials,
}: {
  profile: Tables<"creator_profile">;
  testimonials: Tables<"testimonials">[];
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const stats = [
    { icon: Users, label: "Followers", value: profile.followers_count },
    { icon: TrendingUp, label: "Engagement", value: profile.engagement_rate },
    { icon: Heart, label: "Total Fans", value: profile.total_fans },
  ];

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
          <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Trusted</p>
          <h2 className="text-3xl sm:text-5xl font-display">
            Loved by <span className="text-gradient-gold">half a million</span> fans
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card rounded-2xl p-4 sm:p-6 text-center"
            >
              <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-display text-gradient-gold">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 0 && (
          <div className="relative h-48 sm:h-40 max-w-2xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={false}
                animate={{
                  opacity: i === idx ? 1 : 0,
                  y: i === idx ? 0 : 20,
                  pointerEvents: i === idx ? "auto" : "none",
                }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-center text-center"
              >
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-base sm:text-lg italic text-foreground/90 font-display mb-3">
                  "{t.quote}"
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-gold">{t.name}</span>
                  {t.handle && <span className="opacity-60"> · {t.handle}</span>}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { BadgeCheck, Instagram, Youtube, Twitter, Music2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type SocialLink = Tables<"social_links">;
type Profile = Tables<"creator_profile">;

const iconFor = (p: string) => {
  const k = p.toLowerCase();
  if (k.includes("instagram")) return Instagram;
  if (k.includes("tiktok")) return Music2;
  if (k.includes("youtube")) return Youtube;
  if (k === "x" || k.includes("twitter")) return Twitter;
  return Instagram;
};

export function HeroCard({
  profile,
  social,
}: {
  profile: Profile;
  social: SocialLink[];
}) {
  return (
    <section className="relative px-4 pt-16 pb-12 sm:pt-24 sm:pb-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-radial-glow)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          {/* animated glow halo */}
          <div
            aria-hidden
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full animate-glow"
            style={{
              background:
                "radial-gradient(circle, oklch(0.82 0.14 85 / 0.35) 0%, transparent 60%)",
            }}
          />

          <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-6">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full animate-glow"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.82 0.14 85), oklch(0.58 0.24 305), oklch(0.82 0.14 85))",
                filter: "blur(14px)",
                opacity: 0.7,
              }}
            />
            <div className="relative w-full h-full rounded-full overflow-hidden gold-ring bg-muted">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.name} portrait`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-display text-gradient-gold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
              {profile.name}
            </h1>
            {profile.verified && (
              <BadgeCheck className="w-6 h-6 text-gold fill-gold/20" aria-label="Verified" />
            )}
          </div>

          <p className="relative text-muted-foreground italic text-sm sm:text-base mb-2">
            {profile.tagline}
          </p>
          {profile.bio && (
            <p className="relative text-foreground/70 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              {profile.bio}
            </p>
          )}

          {social.length > 0 && (
            <div className="relative flex items-center justify-center gap-3 mb-7">
              {social.map((s) => {
                const Icon = iconFor(s.platform);
                return (
                  <motion.a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={s.platform}
                    className="w-11 h-11 rounded-full flex items-center justify-center btn-ghost-luxe text-gold"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          )}

          <motion.a
            href={profile.hero_cta_url}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-luxe relative inline-flex items-center justify-center w-full rounded-full px-6 py-4 text-sm sm:text-base"
          >
            {profile.hero_cta_label}
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
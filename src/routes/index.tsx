import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroCard } from "@/components/landing/HeroCard";
import { OffersSection } from "@/components/landing/OffersSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { ContentAccess } from "@/components/landing/ContentAccess";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

async function loadLanding() {
  const [profileRes, socialRes, offersRes, testimonialsRes, contentRes] =
    await Promise.all([
      supabase.from("creator_profile").select("*").limit(1).maybeSingle(),
      supabase.from("social_links").select("*").order("sort_order"),
      supabase.from("offers").select("*").eq("active", true).order("sort_order"),
      supabase.from("testimonials").select("*").order("sort_order"),
      supabase.from("content_previews").select("*").order("sort_order"),
    ]);
  return {
    profile: profileRes.data,
    social: socialRes.data ?? [],
    offers: offersRes.data ?? [],
    testimonials: testimonialsRes.data ?? [],
    content: contentRes.data ?? [],
  };
}

function LandingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["landing"],
    queryFn: loadLanding,
  });

  if (isLoading || !data?.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }

  const { profile, social, offers, testimonials, content } = data;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroCard profile={profile} social={social} />
      {profile.show_offers && <OffersSection offers={offers} />}
      {profile.show_social_proof && (
        <SocialProof profile={profile} testimonials={testimonials} />
      )}
      {profile.show_content_access && <ContentAccess items={content} />}

      <footer className="px-4 py-10 text-center border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <Link
          to="/login"
          className="text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-gold transition-colors mt-2 inline-block"
        >
          Admin
        </Link>
      </footer>
    </main>
  );
}

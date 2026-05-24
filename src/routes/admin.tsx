import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, User, Sparkles, Link2, MessageSquare, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Admin Dashboard" }, { name: "robots", content: "noindex" }],
  }),
});

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "offers", label: "Offers", icon: Sparkles },
  { id: "social", label: "Socials", icon: Link2 },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "content", label: "Content", icon: ImageIcon },
] as const;

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-10 max-w-md text-center">
          <h2 className="text-2xl font-display mb-3">No admin access</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your account doesn't have admin permissions.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
            className="btn-luxe rounded-full px-6 py-3"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-display">
              <span className="text-gradient-gold">Creator Studio</span>
            </h1>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login" });
            }}
            className="btn-ghost-luxe rounded-full px-4 py-2 text-sm text-gold inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </motion.header>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all duration-300 ${
                tab === t.id
                  ? "bg-gradient-gold text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.82_0.14_85/0.6)]"
                  : "btn-ghost-luxe text-gold"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-3xl p-6 sm:p-8"
        >
          {tab === "profile" && <ProfileEditor />}
          {tab === "offers" && (
            <CrudManager
              table="offers"
              title="Premium Offers"
              defaults={{
                icon: "crown",
                title: "New Offer",
                description: "Describe this premium tier.",
                cta_label: "Access",
                cta_url: "https://",
                sort_order: 99,
                active: true,
                created_at: new Date().toISOString(),
              }}
              fields={[
                { key: "title", label: "Title" },
                { key: "icon", label: "Icon (crown, sparkles, users, camera, gem)" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "cta_label", label: "Button label" },
                { key: "cta_url", label: "Button URL", type: "url" },
                { key: "sort_order", label: "Order", type: "number" },
              ]}
            />
          )}
          {tab === "social" && (
            <CrudManager
              table="social_links"
              title="Social Links"
              defaults={{
                platform: "instagram",
                url: "https://",
                sort_order: 99,
                created_at: new Date().toISOString(),
              }}
              fields={[
                { key: "platform", label: "Platform (instagram, tiktok, youtube, x)" },
                { key: "url", label: "URL", type: "url" },
                { key: "sort_order", label: "Order", type: "number" },
              ]}
            />
          )}
          {tab === "testimonials" && (
            <CrudManager
              table="testimonials"
              title="Testimonials"
              defaults={{
                name: "Fan name",
                handle: "@handle",
                quote: "Their words go here.",
                avatar_url: null,
                sort_order: 99,
                created_at: new Date().toISOString(),
              }}
              fields={[
                { key: "name", label: "Name" },
                { key: "handle", label: "Handle" },
                { key: "quote", label: "Quote", type: "textarea" },
                { key: "sort_order", label: "Order", type: "number" },
              ]}
            />
          )}
          {tab === "content" && (
            <CrudManager
              table="content_previews"
              title="Exclusive Content Previews"
              defaults={{
                title: "New Drop",
                description: "A short teaser.",
                thumbnail_url: null,
                cta_label: "Unlock",
                cta_url: "https://",
                badge: "Locked",
                sort_order: 99,
                created_at: new Date().toISOString(),
              }}
              fields={[
                { key: "title", label: "Title" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "thumbnail_url", label: "Thumbnail URL", type: "url" },
                { key: "badge", label: "Badge label" },
                { key: "cta_label", label: "Button label" },
                { key: "cta_url", label: "Button URL", type: "url" },
                { key: "sort_order", label: "Order", type: "number" },
              ]}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}
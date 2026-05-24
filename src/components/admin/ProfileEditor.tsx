import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"creator_profile">;

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("creator_profile")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, []);

  if (!profile) return <p className="text-muted-foreground">Loading…</p>;

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile({ ...profile, [k]: v });

  const uploadAvatar = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("creator-assets")
      .upload(path, file, { upsert: true });
    if (error) {
      setMsg("Upload failed: " + error.message);
      return;
    }
    const { data } = supabase.storage.from("creator-assets").getPublicUrl(path);
    set("avatar_url", data.publicUrl);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("creator_profile")
      .update({
        name: profile.name,
        tagline: profile.tagline,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        verified: profile.verified,
        hero_cta_label: profile.hero_cta_label,
        hero_cta_url: profile.hero_cta_url,
        followers_count: profile.followers_count,
        engagement_rate: profile.engagement_rate,
        total_fans: profile.total_fans,
        show_offers: profile.show_offers,
        show_social_proof: profile.show_social_proof,
        show_content_access: profile.show_content_access,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
    setSaving(false);
    setMsg(error ? "Error: " + error.message : "Saved ✓");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-muted">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold font-display text-2xl">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>
        <label className="btn-ghost-luxe px-4 py-2 rounded-full text-sm cursor-pointer text-gold">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
        </label>
      </div>

      <Field label="Creator name" value={profile.name} onChange={(v) => set("name", v)} />
      <Field label="Tagline" value={profile.tagline} onChange={(v) => set("tagline", v)} />
      <Field label="Bio" value={profile.bio ?? ""} onChange={(v) => set("bio", v)} textarea />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Hero CTA label"
          value={profile.hero_cta_label}
          onChange={(v) => set("hero_cta_label", v)}
        />
        <Field
          label="Hero CTA URL"
          value={profile.hero_cta_url}
          onChange={(v) => set("hero_cta_url", v)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Followers" value={profile.followers_count} onChange={(v) => set("followers_count", v)} />
        <Field label="Engagement" value={profile.engagement_rate} onChange={(v) => set("engagement_rate", v)} />
        <Field label="Total fans" value={profile.total_fans} onChange={(v) => set("total_fans", v)} />
      </div>

      <div className="space-y-2 pt-4 border-t border-border">
        <p className="text-xs uppercase tracking-widest text-gold">Visibility</p>
        <Toggle label="Verified badge" value={profile.verified} onChange={(v) => set("verified", v)} />
        <Toggle label="Premium offers section" value={profile.show_offers} onChange={(v) => set("show_offers", v)} />
        <Toggle label="Social proof section" value={profile.show_social_proof} onChange={(v) => set("show_social_proof", v)} />
        <Toggle label="Exclusive content section" value={profile.show_content_access} onChange={(v) => set("show_content_access", v)} />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button onClick={save} disabled={saving} className="btn-luxe rounded-full px-6 py-3">
          {saving ? "Saving…" : "Save profile"}
        </button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-gold mb-1 block">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-gold/60 focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-gold/60 focus:outline-none"
        />
      )}
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full py-2"
    >
      <span className="text-sm">{label}</span>
      <span
        className={`w-11 h-6 rounded-full p-0.5 transition ${
          value ? "bg-gradient-gold" : "bg-muted"
        }`}
      >
        <span
          className={`block w-5 h-5 rounded-full bg-background transition-transform ${
            value ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}
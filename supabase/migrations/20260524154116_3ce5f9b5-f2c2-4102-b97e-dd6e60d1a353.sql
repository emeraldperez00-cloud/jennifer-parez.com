
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Creator profile (singleton row)
CREATE TABLE public.creator_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Creator Name',
  tagline TEXT NOT NULL DEFAULT 'Premium content for my exclusive community.',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT TRUE,
  hero_cta_label TEXT NOT NULL DEFAULT 'View Exclusive Content',
  hero_cta_url TEXT NOT NULL DEFAULT '#offers',
  show_offers BOOLEAN NOT NULL DEFAULT TRUE,
  show_social_proof BOOLEAN NOT NULL DEFAULT TRUE,
  show_content_access BOOLEAN NOT NULL DEFAULT TRUE,
  followers_count TEXT NOT NULL DEFAULT '125K',
  engagement_rate TEXT NOT NULL DEFAULT '8.4%',
  total_fans TEXT NOT NULL DEFAULT '500K+',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.creator_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profile" ON public.creator_profile FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins update profile" ON public.creator_profile FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert profile" ON public.creator_profile FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.creator_profile (name, tagline, bio) VALUES ('Aurelia Vale', 'Curating luxury, beauty & exclusive moments.', 'Welcome to my private world. Join the inner circle for unreleased shoots, daily diaries, and behind-the-scenes access.');

-- Social links
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read social" ON public.social_links FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage social" ON public.social_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.social_links (platform, url, sort_order) VALUES
('instagram', 'https://instagram.com', 1),
('tiktok', 'https://tiktok.com', 2),
('youtube', 'https://youtube.com', 3),
('x', 'https://x.com', 4);

-- Offers
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'crown',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_label TEXT NOT NULL DEFAULT 'Access Now',
  cta_url TEXT NOT NULL DEFAULT '#',
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read offers" ON public.offers FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage offers" ON public.offers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.offers (icon, title, description, cta_label, cta_url, sort_order) VALUES
('crown', 'VIP Access', 'Full access to my private vault and members-only drops.', 'Join VIP', 'https://example.com/vip', 1),
('sparkles', 'Exclusive Content', 'Unreleased shoots, raw photos, and curated edits.', 'Unlock', 'https://example.com/exclusive', 2),
('users', 'Private Community', 'Direct chat in my exclusive members-only space.', 'Enter', 'https://example.com/community', 3),
('camera', 'Behind the Scenes', 'Daily diaries and shoot day footage.', 'Watch', 'https://example.com/bts', 4),
('gem', 'Premium Resources', 'Style guides, presets, and curated brand picks.', 'Get Access', 'https://example.com/resources', 5);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.testimonials (name, handle, quote, sort_order) VALUES
('Sofia M.', '@sofia.m', 'Honestly the best subscription I''ve had. Worth every cent.', 1),
('Liam R.', '@liamrey', 'The community feels intimate and the content is unmatched.', 2),
('Isabelle T.', '@isabelle', 'Aurelia is the real deal — luxury, taste, and authenticity.', 3);

-- Content previews
CREATE TABLE public.content_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  cta_label TEXT NOT NULL DEFAULT 'Unlock',
  cta_url TEXT NOT NULL DEFAULT '#',
  badge TEXT DEFAULT 'Locked',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_previews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read content" ON public.content_previews FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admins manage content" ON public.content_previews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.content_previews (title, description, badge, cta_url, sort_order) VALUES
('Paris Diaries — Vol. 03', 'Backstage of the spring editorial.', 'VIP Only', 'https://example.com/paris', 1),
('Golden Hour Set', '24 unreleased photographs.', 'Locked', 'https://example.com/golden', 2),
('Late Night Q&A', 'A private 45 min session.', 'Members', 'https://example.com/qa', 3),
('Atelier Visit', 'Inside my favorite couture house.', 'Locked', 'https://example.com/atelier', 4);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('creator-assets', 'creator-assets', TRUE);
CREATE POLICY "Public read assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'creator-assets');
CREATE POLICY "Admins upload assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'creator-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'creator-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'creator-assets' AND public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin role to first user that signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

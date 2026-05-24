
DROP POLICY IF EXISTS "Public read assets" ON storage.objects;
CREATE POLICY "Admins list assets" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'creator-assets' AND public.has_role(auth.uid(), 'admin'));


-- 1. Create the bucket 'product-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Read Access (so everyone can see images)
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- 3. Allow Public Upload Access (so your Admin Panel can upload)
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- 4. Allow Public Update/Delete (Optional, for editing)
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' );

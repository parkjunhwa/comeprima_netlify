-- Supabase Storage 설정
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage 버킷 정책 설정
-- 공개 읽기
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow public to read portfolio files'
  ) THEN
    CREATE POLICY "Allow public to read portfolio files"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'portfolio-files');
  END IF;
END $$;

-- 인증된 사용자만 업로드
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload portfolio files'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload portfolio files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-files');
  END IF;
END $$;

-- 인증된 사용자만 업데이트
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update portfolio files'
  ) THEN
    CREATE POLICY "Allow authenticated users to update portfolio files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-files')
    WITH CHECK (bucket_id = 'portfolio-files');
  END IF;
END $$;

-- 인증된 사용자만 삭제
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete portfolio files'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete portfolio files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-files');
  END IF;
END $$;


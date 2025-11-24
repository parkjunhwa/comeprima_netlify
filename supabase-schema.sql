-- Portfolio 테이블
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notices 테이블
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) 활성화
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 공개 읽기 (모든 사용자 - anon 및 authenticated)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'portfolio' 
    AND policyname = 'Allow public to read portfolio'
  ) THEN
    CREATE POLICY "Allow public to read portfolio"
      ON portfolio FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- 인증된 사용자만 쓰기 (INSERT, UPDATE, DELETE)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'portfolio' 
    AND policyname = 'Allow authenticated users to insert portfolio'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert portfolio"
      ON portfolio FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'portfolio' 
    AND policyname = 'Allow authenticated users to update portfolio'
  ) THEN
    CREATE POLICY "Allow authenticated users to update portfolio"
      ON portfolio FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'portfolio' 
    AND policyname = 'Allow authenticated users to delete portfolio'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete portfolio"
      ON portfolio FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Notices 테이블 정책
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notices' 
    AND policyname = 'Allow public to read notices'
  ) THEN
    CREATE POLICY "Allow public to read notices"
      ON notices FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notices' 
    AND policyname = 'Allow authenticated users to insert notices'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert notices"
      ON notices FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notices' 
    AND policyname = 'Allow authenticated users to update notices'
  ) THEN
    CREATE POLICY "Allow authenticated users to update notices"
      ON notices FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notices' 
    AND policyname = 'Allow authenticated users to delete notices'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete notices"
      ON notices FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;


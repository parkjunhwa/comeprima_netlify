import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 빌드 시에는 환경 변수가 없을 수 있으므로 더 유연하게 처리
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // 서버 사이드에서는 에러 발생
      throw new Error(
        'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
      );
    }
    // 클라이언트 사이드에서는 빈 값으로 처리 (런타임에 에러 발생)
    console.error('Missing Supabase environment variables');
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  );
}


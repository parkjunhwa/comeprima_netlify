'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState('');
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  // 컴포넌트 마운트 시 환경 변수 확인
  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
      setSupabaseError('');
    } catch (err: any) {
      setSupabaseError(err.message);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase || supabaseError) {
      setError('Supabase가 구성되지 않았습니다. 관리자에게 문의하세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 세션이 완전히 설정될 때까지 대기
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 세션 확인
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          // 강제 리다이렉트로 페이지 이동 (전체 페이지 새로고침)
          window.location.href = '/admin/dashboard';
        } else {
          // 세션이 없으면 재시도
          await new Promise(resolve => setTimeout(resolve, 500));
          const { data: retrySession } = await supabase.auth.getSession();
          if (retrySession.session) {
            window.location.href = '/admin/dashboard';
          } else {
            throw new Error('세션 설정에 실패했습니다. 다시 시도해주세요.');
          }
        }
      }
    } catch (err: any) {
      let errorMessage = err.message || '로그인에 실패했습니다.';
      
      // 더 자세한 에러 메시지 제공
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.';
      } else if (err.message?.includes('User not found')) {
        errorMessage = '등록되지 않은 이메일입니다.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            관리자 로그인
          </h2>
        </div>

        {/* Supabase 환경 변수 에러 */}
        {supabaseError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <p className="font-semibold mb-2">⚠️ 환경 변수 설정 필요</p>
            <p className="text-sm mb-3">{supabaseError}</p>
            <div className="bg-white p-3 rounded text-xs text-gray-700 border border-yellow-100">
              <p className="font-semibold mb-2">해결 방법:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>프로젝트 루트에 <code className="bg-gray-100 px-1">.env.local</code> 파일 생성</li>
                <li><a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase 대시보드</a>에서 다음 정보 복사:</li>
                <li className="ml-4">
                  <code className="bg-gray-100 px-1 block">NEXT_PUBLIC_SUPABASE_URL=your_url</code>
                  <code className="bg-gray-100 px-1 block">NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key</code>
                  <code className="bg-gray-100 px-1 block">ADMIN_EMAIL=admin@comeprima.co.kr</code>
                </li>
                <li>개발 서버 재시작: <code className="bg-gray-100 px-1">npm run dev</code></li>
              </ol>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-semibold mb-1">로그인 실패</p>
              <p className="text-sm">{error}</p>
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-red-600 font-semibold mb-1">문제 해결 방법:</p>
                <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                  <li>Supabase에서 계정이 생성되었는지 확인</li>
                  <li>이메일과 비밀번호가 정확한지 확인</li>
                  <li>.env.local의 ADMIN_EMAIL과 일치하는지 확인</li>
                  <li>Supabase Authentication 설정 확인</li>
                </ul>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!supabaseError}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!!supabaseError}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !!supabaseError}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : supabaseError ? '환경 변수 설정 필요' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

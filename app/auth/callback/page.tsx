'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // URL에서 토큰 처리
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');
        const type = searchParams.get('type');

        // 에러 처리
        if (error) {
          setError(`인증 오류: ${error_description || error}`);
          setLoading(false);
          return;
        }

        // 코드가 있으면 세션 교환
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            setError(`세션 설정 오류: ${exchangeError.message}`);
            setLoading(false);
            return;
          }

          // 인증 타입에 따라 다른 페이지로 리다이렉트
          if (type === 'recovery') {
            // 비밀번호 초기화/복구인 경우 비밀번호 변경 페이지로 이동
            router.push('/auth/update-password');
          } else if (type === 'signup') {
            // 회원가입인 경우
            router.push('/admin/dashboard');
          } else {
            // 기본적으로 대시보드로 이동
            router.push('/admin/dashboard');
          }
        } else {
          setError('인증 토큰을 찾을 수 없습니다.');
          setLoading(false);
        }
      } catch (err: any) {
        setError(`예상치 못한 오류: ${err.message}`);
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">인증 처리 중...</p>
          <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-center text-xl font-bold text-gray-900 mb-4">인증 오류</h2>
          <p className="text-center text-red-600 mb-6">{error}</p>
          <div className="space-y-2">
            <a
              href="/auth/login"
              className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              로그인 페이지로 돌아가기
            </a>
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">로딩 중...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}


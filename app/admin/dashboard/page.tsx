import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// 동적 렌더링 강제 (cookies 사용으로 인해 정적 생성 불가)
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let user, admin, noticeCount = 0;

  try {
    user = await getCurrentUser();
    admin = await isAdmin();

    if (!user || !admin) {
      redirect('/auth/login');
    }

    const supabase = await createClient();

    // Get notice count
    const { count: notice } = await supabase
      .from('notices')
      .select('*', { count: 'exact', head: true });
    noticeCount = notice || 0;
  } catch (error: any) {
    console.error('Dashboard error:', error);
    // 환경 변수 오류인 경우 로그인 페이지로 리다이렉트
    if (error.message?.includes('Missing Supabase environment variables')) {
      redirect('/auth/login');
    }
    // 기타 오류는 계속 진행하되 카운트는 0으로 표시
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          {user && <p className="text-gray-600 mt-2">환영합니다, {user.email}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">공지사항</h3>
            <p className="text-3xl font-bold text-green-600">{noticeCount}</p>
            <Link
              href="/admin/notices"
              className="text-green-600 hover:text-green-800 text-sm mt-4 inline-block"
            >
              관리하기 →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">빠른 링크</h2>
            <Link
              href="/admin/dashboard/debug"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              디버그 정보
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/notices/new"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">새 공지사항 작성</h3>
              <p className="text-sm text-gray-600 mt-1">공지사항을 작성합니다</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


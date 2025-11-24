import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

// 동적 렌더링 강제 (cookies 사용으로 인해 정적 생성 불가)
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) {
    redirect('/auth/login');
  }

  return (
    <div>
      {children}
    </div>
  );
}


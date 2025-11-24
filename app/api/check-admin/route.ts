import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          isAdmin: false,
          error: 'Missing Supabase environment variables',
          details: {
            userEmail: '없음',
            adminEmails: [],
            isInList: false,
            hasUser: false,
          },
        },
        { status: 500 }
      );
    }

    // API 라우트에서 직접 쿠키를 읽어서 Supabase 클라이언트 생성
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // API 라우트에서는 쿠키 설정이 제한적이므로 무시
          },
        },
      }
    );

    // 사용자 정보 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || [];
    const userEmail = (user?.email || '').toLowerCase();
    const isAdminUser = user && adminEmails.includes(userEmail);

    return NextResponse.json({
      isAdmin: isAdminUser,
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
      details: {
        userEmail: userEmail || '없음',
        adminEmails: adminEmails,
        isInList: adminEmails.includes(userEmail),
        hasUser: !!user,
        userError: userError?.message || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        isAdmin: false, 
        error: error.message,
        details: {
          userEmail: '없음',
          adminEmails: process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || [],
          isInList: false,
          hasUser: false,
        },
      },
      { status: 500 }
    );
  }
}


import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

// 이미지 파일인지 확인하는 함수
function isImageFile(url: string | null): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

export default async function NoticesPage() {
  let notices = null;
  let error = null;

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    notices = data;
    error = fetchError;
  } catch (err: any) {
    console.error('Failed to fetch notices:', err);
    error = err;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">공지사항</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold mb-1">데이터를 불러올 수 없습니다</p>
            <p className="text-sm">
              {error.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <p className="text-xs mt-2">
              환경 변수가 올바르게 설정되었는지 확인하세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">공지사항</h1>
        
        <div className="space-y-6">
          {notices?.map((notice: any) => {
            const hasImageFile = notice.file_url && isImageFile(notice.file_url);
            const hasImageUrl = notice.image_url;
            
            return (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2 mb-2">{notice.content}</p>
                
                {/* 이미지 썸네일 표시 */}
                {(hasImageFile || hasImageUrl) && (
                  <div className="mt-4">
                    {hasImageFile && (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <Image
                          src={notice.file_url}
                          alt={notice.file_name || '첨부 이미지'}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    {hasImageUrl && (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <Image
                          src={notice.image_url}
                          alt={notice.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* 첨부파일 정보 표시 */}
                {(notice.file_url || notice.image_url) && (
                  <div className="flex items-center gap-2 mt-2">
                    {notice.file_url && !hasImageFile && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        첨부파일
                      </span>
                    )}
                    {hasImageFile && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        이미지
                      </span>
                    )}
                    {notice.image_url && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        이미지
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          }) || (
            <div className="text-center py-12 text-gray-500">
              공지사항이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


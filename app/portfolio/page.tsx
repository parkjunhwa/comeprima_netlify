'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { useEffect } from 'react';

function isImageFile(url: string | null): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

function getImageUrl(item: any): string | null {
  if (item.image_url) return item.image_url;
  if (item.file_url && isImageFile(item.file_url)) return item.file_url;
  return null;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        setPortfolios(data || []);
      } catch (err: any) {
        console.error('Failed to fetch portfolios:', err);
        setError({
          message: '데이터를 불러올 수 없습니다. 나중에 다시 시도해주세요.',
          details: err?.message
        });
        // 기본값으로 빈 배열 설정하여 페이지 렌더링 계속
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-24 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">포트폴리오</h1>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            <p className="font-semibold mb-1">⚠️ 주의</p>
            <p className="text-sm">{error.message}</p>
            {error.details && (
              <p className="text-xs mt-2 text-yellow-600">{error.details}</p>
            )}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">포트폴리오</h1>
        
        {/* 반응형 갤러리 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {portfolios.map((item: any) => {
            const imageUrl = getImageUrl(item);
            
            return (
              <div
                key={item.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-gray-200 aspect-square"
                onClick={() => setSelectedItem(item)}
              >
                {/* 썸네일 이미지 */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-500 text-xs text-center px-2">이미지 없음</span>
                  </div>
                )}

                {/* 어두워지는 오버레이 */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                {/* 제목과 카테고리 - 하단에서 올라오는 애니메이션 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium line-clamp-1 mb-1">
                    {item.category && <span>{item.category}</span>}
                  </p>
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {portfolios.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            포트폴리오 항목이 없습니다.
          </div>
        )}
      </div>

      {/* 모달 창 */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                {selectedItem.category && (
                  <p className="text-sm text-indigo-600 font-medium">{selectedItem.category}</p>
                )}
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 이미지 */}
              {getImageUrl(selectedItem) && (
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(selectedItem)!}
                    alt={selectedItem.title}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              )}

              {/* 설명 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">설명</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* 첨부 파일 */}
              {selectedItem.file_url && !isImageFile(selectedItem.file_url) && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">첨부 파일</h3>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedItem.file_name || '첨부 파일'}
                      </p>
                    </div>
                    <a
                      href={selectedItem.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                    >
                      다운로드
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


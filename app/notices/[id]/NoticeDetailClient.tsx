'use client';

import { useState } from 'react';
import Link from 'next/link';

// 이미지 파일인지 확인하는 함수
function isImageFile(url: string | null): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

interface NoticeDetailClientProps {
  notice: {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    file_url: string | null;
    file_name: string | null;
    created_at: string;
  };
}

export default function NoticeDetailClient({ notice }: NoticeDetailClientProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string>('');

  const handleImageClick = (url: string) => {
    setModalImageUrl(url);
    setImageModalOpen(true);
  };

  const hasImageFile = notice.file_url && isImageFile(notice.file_url);

  return (
    <>
      <div className="min-h-screen bg-black py-24">
        {/* 상단 네비게이션 */}
        <div className="container mx-auto px-4 max-w-4xl mb-8">
          <Link
            href="#notices"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            공지사항으로 돌아가기
          </Link>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="bg-gray-900 border border-gray-800 rounded-lg p-8 md:p-12">
            {/* 제목 섹션 */}
            <div className="mb-8 pb-8 border-b border-gray-800">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{notice.title}</h1>
              <p className="text-sm text-gray-400">
                {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* 본문 */}
            <div className="mb-8 pb-8 border-b border-gray-800">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                {notice.content}
              </p>
            </div>

            {/* 이미지 URL 표시 */}
            {notice.image_url && (
              <div className="mb-8 pb-8 border-b border-gray-800">
                <p className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wider">
                  이미지
                </p>
                <div
                  className="cursor-pointer overflow-hidden rounded-lg group"
                  onClick={() => handleImageClick(notice.image_url!)}
                >
                  <img
                    src={notice.image_url}
                    alt={notice.title}
                    className="w-full h-auto max-h-96 object-contain bg-gray-800 group-hover:opacity-80 transition-opacity"
                  />
                </div>
              </div>
            )}

            {/* 첨부 파일 표시 */}
            {notice.file_url && (
              <div>
                {hasImageFile ? (
                  // 이미지 파일인 경우 이미지로 표시
                  <div>
                    <p className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wider">
                      첨부 이미지
                    </p>
                    <div
                      className="cursor-pointer overflow-hidden rounded-lg group mb-4"
                      onClick={() => handleImageClick(notice.file_url!)}
                    >
                      <img
                        src={notice.file_url}
                        alt={notice.file_name || '첨부 이미지'}
                        className="w-full h-auto max-h-96 object-contain bg-gray-800 group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-300">{notice.file_name || '첨부 파일'}</p>
                      <a
                        href={notice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-400 text-black text-sm rounded font-medium hover:bg-green-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        새 창에서 보기
                      </a>
                    </div>
                  </div>
                ) : (
                  // 일반 파일인 경우 다운로드 링크
                  <div>
                    <p className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wider">
                      첨부파일
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                      <svg
                        className="w-6 h-6 text-green-400 shrink-0"
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
                        <p className="text-sm font-medium text-gray-200">
                          {notice.file_name || '첨부 파일'}
                        </p>
                      </div>
                      <a
                        href={notice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-400 text-black text-sm rounded font-medium hover:bg-green-300 transition-colors shrink-0"
                      >
                        다운로드
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        </div>
      </div>

      {/* 이미지 모달 */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10 transition-all"
              aria-label="이미지 모달 닫기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={modalImageUrl}
              alt="확대 이미지"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

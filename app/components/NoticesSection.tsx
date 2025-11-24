'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import FloatingNeonDots from './FloatingNeonDots';
import { usePathname } from 'next/navigation';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  file_url?: string;
  file_name?: string;
}

function isImageFile(url: string | null): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
}

function getImageUrl(item: Notice): string | null {
  if (item.image_url) return item.image_url;
  if (item.file_url && isImageFile(item.file_url)) return item.file_url;
  return null;
}

interface NoticesSectionProps {
  sectionIndex: number;
  currentSection: number;
}

export default function NoticesSection({ sectionIndex, currentSection }: NoticesSectionProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const fullTitle = 'Notices';
  const pathname = usePathname();

  // 페이지 이동 시 애니메이션 초기화
  useEffect(() => {
    setHasAnimated(false);
    setDisplayedTitle('');
  }, [pathname]);

  // currentSection이 변경될 때 애니메이션 초기화
  useEffect(() => {
    if (currentSection !== sectionIndex) {
      setHasAnimated(false);
      setDisplayedTitle('');
    } else {
      // 해당 섹션이 활성화되면 즉시 제목을 빈 문자열로 초기화
      setHasAnimated(false);
      setDisplayedTitle('');
    }
  }, [currentSection, sectionIndex]);

  // 타이핑 애니메이션 (currentSection이 해당 섹션과 일치하면 0.5초 후 시작)
  useEffect(() => {
    if (currentSection !== sectionIndex) {
      // 다른 섹션이면 기존 interval 정리
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      return;
    }

    // 이미 애니메이션이 완료되었으면 중복 실행 방지
    if (displayedTitle === fullTitle) {
      return;
    }

    const timeoutId = setTimeout(() => {
      typingIndexRef.current = 0;
      setDisplayedTitle(''); // 시작 시 빈 문자열로 초기화
      
      typingIntervalRef.current = setInterval(() => {
        typingIndexRef.current++;
        if (typingIndexRef.current <= fullTitle.length) {
          setDisplayedTitle(fullTitle.slice(0, typingIndexRef.current));
        }
        
        if (typingIndexRef.current >= fullTitle.length) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }
      }, 100);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentSection, sectionIndex, fullTitle]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/notices?select=*&order=created_at.desc&limit=3`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
          }
        );

        if (!response.ok) throw new Error('공지사항을 불러올 수 없습니다');

        const data = await response.json();
        setNotices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full w-full flex items-center justify-center px-8 relative overflow-hidden right-menu-page-padding">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        
        {/* 부유하는 네온 점들 */}
        <FloatingNeonDots />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* 좌측: UX/UI 정보 (고정 140px, shrink-0) */}
          <div className="flex flex-col justify-top w-full lg:w-[220px] shrink-0 lg:pr-0 mb-10 lg:mb-0">
            <h2 className="text-2xl font-bold mb-4 relative" ref={titleRef}>
              {/* 전체 제목을 투명하게 렌더링하여 높이 고정 */}
              <span className="opacity-0 pointer-events-none">
                {fullTitle}
              </span>
              {/* 타이핑되는 제목 */}
              <span 
                className={`neon-text absolute top-0 left-0 ${currentSection === sectionIndex ? 'title-visible' : 'title-hidden'}`}
              >
                {displayedTitle}
              </span>
            </h2>
            
            {/* 서비스 정보 */}
            <div className="space-y-4">
              {/* 서비스 소개 - ServicesSection 내용 기반으로 수정 */}
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Publishing</h3>
                <ul className="space-y-0 text-sm text-gray-300">
                  <li className="hover:text-green-400 transition-colors cursor-pointer">React 기반 퍼블리싱</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">Vue.js 기반 퍼블리싱</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">Next.js 데쉬보드 구축</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">반응형 웹 개발</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">기업형 시스템 구축</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Design</h3>
                <ul className="space-y-0 text-sm text-gray-300">
                  <li className="hover:text-green-400 transition-colors cursor-pointer">UI/UX 디자인</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">웹/모바일/앱 디자인</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">데쉬보드 디자인</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">반응형 디자인</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">디자인 시스템 구축</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">강점</h3>
                <ul className="space-y-0 text-sm text-gray-300">
                  <li className="hover:text-green-400 transition-colors cursor-pointer">디자인부터 퍼블리싱까지 원스톱 제공</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">커뮤니케이션 비용 최소화</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">일관성 있는 디자인 시스템</li>
                  <li className="hover:text-green-400 transition-colors cursor-pointer">실용적이고 개발 친화적인 결과물</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 우측: 공지사항 목록 (가변 flex-1) */}
          <div className="flex flex-col justify-top flex-1">
            {loading ? (
              <div className="text-gray-400">로딩 중...</div>
            ) : error ? (
              <div className="text-gray-400">{error}</div>
            ) : notices.length === 0 ? (
              <div className="text-gray-400">공지사항이 없습니다</div>
            ) : (
              <div className="space-y-8">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="group cursor-pointer pb-4 border-b border-gray-800 hover:border-green-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold group-hover:text-green-400 transition-colors max-w-xs">
                        {notice.title}
                      </h3>
                      <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                        {formatDate(notice.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{notice.content}</p>
                    
                    {/* 첨부파일 배지 */}
                    <div className="flex gap-2 mb-3">
                      {notice.file_url && (
                        <span className="inline-block px-2 py-1 bg-green-400 bg-opacity-10 text-green-950 text-xs rounded">
                          첨부파일
                        </span>
                      )}
                      {notice.image_url && (
                        <span className="inline-block px-2 py-1 bg-blue-400 bg-opacity-10 text-blue-950 text-xs rounded">
                          이미지
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달 창 */}
      {selectedNotice && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-black border-2 border-green-400/30 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden neon-glow relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 네온 테두리 효과 */}
            <div className="absolute inset-0 rounded-lg border-2 border-green-400/20 pointer-events-none"></div>
            
            {/* 닫기 버튼 */}
            <div className="sticky top-0 bg-black/98 border-b border-green-400/20 px-6 py-4 flex justify-between items-center z-10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Notice</span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-gray-400 hover:text-green-400 text-2xl transition-all duration-300 hover:scale-110 w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-400/10"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* 이미지 (이미지인 경우만 표시) */}
              {getImageUrl(selectedNotice) && (
                <div className="rounded-lg overflow-hidden bg-gray-900 border border-green-400/10">
                  <div className="relative w-full" style={{ minHeight: '280px' }}>
                    <Image
                      src={getImageUrl(selectedNotice)!}
                      alt={selectedNotice.title}
                      fill
                      className="object-contain w-full h-full"
                      sizes="(max-width: 768px) 100vw, 80vw"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {/* 상세 정보 */}
              <div className="space-y-4">
                <div className="border-l-2 border-green-400/50 pl-4">
                  <h2 className="text-2xl font-bold neon-text">{selectedNotice.title}</h2>
                </div>

                <div className="pt-2">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedNotice.content}
                  </p>
                </div>

                {selectedNotice.created_at && (
                  <div className="flex items-center gap-2 pt-2">
                    <svg
                      className="w-4 h-4 text-green-400/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">{formatFullDate(selectedNotice.created_at)}</p>
                  </div>
                )}

                {/* 첨부파일 (이미지가 아닌 경우 다운로드 제공) */}
                {selectedNotice.file_url && !isImageFile(selectedNotice.file_url) && (
                  <div className="border-t border-green-400/20 pt-6 mt-6">
                    <span className="text-xs text-green-400/60 uppercase tracking-wider mb-3 block font-medium">Attachment</span>
                    <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-colors">
                      <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-400"
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
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-300">
                          {selectedNotice.file_name || '첨부 파일'}
                        </p>
                      </div>
                      <a
                        href={selectedNotice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="px-4 py-2 bg-green-400 text-black text-sm rounded-lg hover:bg-green-300 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-green-400/50"
                      >
                        다운로드
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

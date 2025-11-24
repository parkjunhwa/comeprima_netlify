'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import FloatingNeonDots from './FloatingNeonDots';
import { usePathname } from 'next/navigation';

interface GallerySectionProps {
  sectionIndex: number;
  currentSection: number;
}

export default function GallerySection({ sectionIndex, currentSection }: GallerySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const imageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const fullTitle = 'Gallery';
  const pathname = usePathname();

  // 갤러리 이미지 목록 가져오기
  useEffect(() => {
    const fetchGalleryImages = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/gallery-images');
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          setGalleryImages(data.images);
        } else {
          setGalleryImages([]);
        }
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

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

  // Intersection Observer로 lazy loading 구현
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || galleryImages.length === 0 || loading) return;

    // 기존 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // 처음 몇 개의 이미지는 즉시 로드 (첫 화면에 보이는 이미지들)
    const initialVisibleCount = Math.min(12, galleryImages.length);
    setVisibleImages(new Set(Array.from({ length: initialVisibleCount }, (_, i) => i)));

    // DOM이 업데이트된 후 observer 설정
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
              setVisibleImages((prev) => {
                const newSet = new Set(prev);
                newSet.add(index);
                return newSet;
              });
            }
          });
        },
        {
          root: container,
          rootMargin: '200px', // 뷰포트 200px 전에 미리 로드
          threshold: 0.01,
        }
      );

      observerRef.current = observer;

      // 모든 이미지 요소 관찰
      imageRefs.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [galleryImages.length, loading]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 컨테이너가 스크롤 가능한지 확인
      const isAtTop = container.scrollTop === 0;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;

      // 맨 위에서 위로 스크롤하거나 맨 아래에서 아래로 스크롤할 때
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        // 내부 스크롤이 끝에 도달했을 때 이벤트를 preventDefault하지 않고 자연스럽게 전파
        // 이렇게 하면 전체 페이지 스크롤로 자연스럽게 이어짐
        return;
      }

      // 내부 스크롤이 가능한 경우에만 preventDefault
      e.preventDefault();
      container.scrollTop += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        <FloatingNeonDots />
      </div>

      {/* 메인 콘텐츠 (내부 스크롤) */}
      <div 
        ref={scrollContainerRef}
        className="relative z-10 w-full h-full overflow-y-auto pt-12 pb-16 px-4 text-sm scroll-container right-menu-page-padding"
      >
        {/* 섹션 제목 */}
        <div className="mb-6" ref={titleRef}>
          <h2 className="text-2xl font-bold mb-6 relative">
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
        </div>

        {/* Masonry 갤러리 그리드 */}
        {loading ? (
          <div className="text-gray-400">로딩 중...</div>
        ) : galleryImages.length === 0 ? (
          <div className="text-gray-400">이미지가 없습니다</div>
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-4">
            {galleryImages.map((imageUrl, index) => {
              const isVisible = visibleImages.has(index);
              return (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) {
                      imageRefs.current.set(index, el);
                    } else {
                      imageRefs.current.delete(index);
                    }
                  }}
                  data-index={index}
                  className="relative group mb-4 break-inside-avoid overflow-hidden rounded-lg bg-gray-900"
                >
                  {/* 썸네일 이미지 - 원본 비율 유지, lazy loading */}
                  <div className="relative w-full">
                    {isVisible ? (
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        width={800}
                        height={800}
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16.66vw, (max-width: 1280px) 12.5vw, 8.33vw"
                        loading="lazy"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-800 animate-pulse flex items-center justify-center">
                        <div className="text-gray-600 text-xs">Loading...</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

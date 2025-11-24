'use client';

import { useEffect, useRef, useState } from 'react';
import FloatingNeonDots from './FloatingNeonDots';
import { ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface ServicesSectionProps {
  sectionIndex: number;
  currentSection: number;
}

export default function ServicesSection({ sectionIndex, currentSection }: ServicesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const fullTitle = 'Services';
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-5"></div>
        <FloatingNeonDots />
      </div>

      {/* 메인 콘텐츠 (내부 스크롤) */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full h-full overflow-y-auto pt-12 pb-16 px-8 text-sm scroll-container right-menu-page-padding"
      >
        {/* 섹션 제목 */}
        <div className="mb-8" ref={titleRef}>
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

        {/* 서비스 소개 */}
        <div className="space-y-8">
          {/* 메인 소개 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              퍼블리싱 & 디자인을 동시에 제공하는 전문가
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              코메프리마는 <span className="text-green-400 font-semibold">퍼블리싱</span>과 <span className="text-green-400 font-semibold">디자인</span>을
              동시에 제공할 수 있는 전문 작업자입니다. 단순히 디자인만 하거나 퍼블리싱만 하는 것이 아니라,
              전체 프로세스를 이해하고 통합적으로 작업할 수 있는 능력을 보유하고 있습니다.
            </p>
          </div>

          {/* 서비스 카테고리 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* 퍼블리싱 서비스 */}
            <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/30 hover:border-green-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-lg font-bold text-white">퍼블리싱 서비스</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                최신 프론트엔드 기술을 활용한 고품질 퍼블리싱 서비스를 제공합니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">React 기반 퍼블리싱</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Vue.js 기반 퍼블리싱</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Next.js 데쉬보드 구축</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">반응형 웹 개발</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">기업형 시스템 구축</span>
                </div>
              </div>
            </div>

            {/* 디자인 서비스 */}
            <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/30 hover:border-green-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="text-lg font-bold text-white">디자인 서비스</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                사용자 경험을 고려한 UI/UX 디자인과 퍼블리싱 가능한 디자인을 제공합니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">UI/UX 디자인</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">웹/모바일/웹/앱 디자인</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">데쉬보드 디자인</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">반응형 디자인</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">디자인 시스템 구축</span>
                </div>
              </div>
            </div>
          </div>

          {/* 통합 서비스 강점 */}
          <div className="border-l-2 border-green-400 pl-6 py-4 mt-8 bg-gray-900/20 rounded-r-lg">
            <h4 className="text-lg font-bold text-white mb-3">통합 서비스의 강점</h4>
            <p className="text-gray-300 leading-relaxed mb-3">
              디자인과 퍼블리싱을 분리하지 않고 <span className="text-green-400 font-semibold">원스톱으로 제공</span>함으로써,
              디자인과 개발 간의 소통 비용을 줄이고 더 효율적이고 일관성 있는 결과물을 만들어냅니다.
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>디자인부터 퍼블리싱까지 전체 프로세스 이해</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>디자인과 개발 간의 소통 비용 최소화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>퍼블리싱 가능한 실용적인 디자인 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>일관성 있는 디자인 시스템 구축</span>
              </li>
            </ul>
          </div>

          {/* 데쉬보드 예제 버튼 */}
          <div className="mt-10 pt-8 border-t border-gray-800">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-400 text-sm text-center">
                Next.js 기반 업무용 데쉬보드 퍼블리싱 예제를 확인해보세요
              </p>
              <a
                href="https://dashboardsample-six.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-400/50 rounded-lg text-green-400 hover:bg-green-500/30 hover:border-green-400 transition-all duration-300"
              >
                <span className="font-semibold">Next.js 데쉬보드 예제</span>
                <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


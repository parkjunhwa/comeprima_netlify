'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AboutSectionProps {
  sectionIndex: number;
  currentSection: number;
}

export default function AboutSection({ sectionIndex, currentSection }: AboutSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const fullTitle = 'AboutUs';
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
      {/* 배경 블러 효과 */}
      <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-50"></div>

      {/* 메인 콘텐츠 (내부 스크롤) */}
      <div 
        ref={scrollContainerRef}
        className="relative z-10 w-full h-full overflow-y-auto pt-12 pb-16 px-8 text-sm scroll-container right-menu-page-padding"
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

        {/* 회사 소개 */}
        <div className="space-y-6 mb-6">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              코메프리마(Comeprima) 디자인
            </h3>
            <p className="text-gray-300 leading-relaxed">
              우리는 웹디자인과 UI/UX 디자인을 전문으로 하는 디자인,퍼블리싱 에이전시입니다.
            </p>
            <p className="text-gray-400 leading-relaxed">
              전세계적으로 나와있는 거의 모든 웹퍼블리싱 기술을 보유하고 있으며,
              HTML, React, Angular, Vue 다양한 프론트 기술을 활용합니다.
            </p>
            <p className="text-gray-400 leading-relaxed">
              반응형, 기업형 데쉬보드 구축 서비스를 주요 업무로 하고 있습니다.
            </p>
          </div>

          {/* 대표 소개 */}
          <div className="border-l-2 border-green-400 pl-4 py-0">
            <h4 className="text-sm font-semibold mb-1 text-white">Designer/Publisher</h4>
            <p className="text-gray-300 text-xs">박준화</p>
          </div>
        </div>

        {/* 주요 경험 */}
        <div className="border-t border-gray-800 pt-4 mt-4">
          <h3 className="text-lg font-bold mb-3 text-white">Key Experience</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {[
              '25 웅진IT 디자인,퍼블리싱 운영 수석',
              '25 나이스인프라 정산시스템 (UI/UX디자인, Next.js퍼블리싱)',
              '25 명인제약 ERP (UI/UX디자인, VUE퍼블리싱)',
              '23~24 우리은행 원뱅킹 운영업무(퍼블리셔)',
              '23 Samsung Developers, SDC 사이트 스타일가이드',
              '22 부산은행 모바일 앱 UI UX 운영업무',
              '21 부산저축은행 모바일 앱 (안드로이드, IOS, WEB)',
              '20 부산은행 업무지원시스템 전체 디자인',
              '19 부산은행 Sumstore(가맹점 앱) 전체 디자인 (안드로이드, IOS)',
              '18 Gosellay',
              '18 한국일보 WCMS',
              '17 (주)서플러스 글로벌 KMS시스템 모바일',
              '17 (주)서플러스 글로벌 KMS시스템',
              '17 마스터 드라이빙',
              '16 KT 도메인사용관리 시스템',
              '16 K-bank 포털',
              '16 솔루피아 워드프레스 버전 리뉴얼',
              '16 신한금융그룹 인트라넷 결제시스템',
              '16 건물에너지 상세 사용량 계측을 위한 현장조사표관리시스템',
              '15 KTDIM',
              '15 Loveandmoney',
              '15 reprint',
              '15 레드페이퍼',
              '15 나우히어링',
              '15 김정국기타공방',
              '14 기가코리아 홈페이지',
              '14 기가코리아 슈퍼관리자 반응형 웹앱',
              '14 기가코리아 몰관리자 반응형 웹앱',
              '14 S2B 쇼핑몰 케이에스리테일 쇼핑몰',
              '13 에듀넷 반응형 교육컨텐츠',
              '13 유,아동 쇼핑몰 아이모아',
              '13 다아라기계장터 모바일 포털',
              '13 비더비즈 S2B 쇼핑몰',
              '13 솔루피아 리뉴얼',
              '12 삼성물산 모바일 웹앱',
              '12 김정국기타 리뉴얼(영문)',
              '12 Tagwing 홈페이지,모바일',
              '12 LG전자 스마트TV 홈데쉬보드',
              '12 팔도푸드 모바일 웹애플리케이션',
              '12 리바트 모바일 웹애플리케이션',
              '11 한국산업진흥원 모바일',
              '11 산업포탈 다아라',
              '11 GS 경영층 의사 지원 시스템 MEIS',
              '11 wowguitar 리뉴얼',
              '11 한국 사이버대학교 리뉴얼',
              '10 한국 웹접근성 연구소 – 개발자를 위한 교육컨텐츠 디자인/(표준)웹코딩',
              '10 연예기사포털 TV리포트 웹접근성 리뉴얼 디자인/웹코딩',
              '10 광주광역시교육청 u-러닝 교육포털',
              '09 서울시의회 전자투표시스템 전체 디자인',
              '09 ELPAPA리뉴얼',
              '08 ELPAPA',
              '08 (주)RKFN',
              '08 GE HELTH 웹진 정기발간',
              '08 KOICA뉴스레터월간,작업진행중',
              '08 에스깔리에',
              '08 인터프로매뉴팩츄링코리아',
              '07 SKYLIFE MYTV 디자인,코딩',
              '07 국정홍보처 KOICA 뉴스레터(월간)',
              '07 GE 계간웹진 정기발간',
              '07 등공예품 전문 쇼핑몰',
              '07 잠실 모던잉글리시 어학원',
              '07 (주)포이즈앤컴팩트',
              '07 유학닷컴 리뉴얼',
              '06 lg telecom ez-account system 웹디자인',
              '06 유아동복 해외구매대행',
              '06 tehome',
              '06 수입명품화장품몰 코스메틱24',
              '06 유니이샵',
              '05 프로모 인터네셔날',
              '05 강원대학교 물리학과',
              '05 강원대학교 영어영문학과',
              '05 강원대학교 회계학과',
              '05 서울건축학원',
              '05 서울미대편입학원',
              '04 일본 디지탈 스튜디오 맥레이 작업',
              '04 수향농원',
              '04 김정국 기타 제작소',
              '04 강원대학교 미생물학과',
              '04 구두종합쇼핑몰',
              '04 벨소리 5424.com 사이트리뉴얼 참여',
              '03 한국건축사협회 리뉴얼프로젝트 디자인팀장',
              '03 한국토지공사 인사평가시스템 ui디자인',
              '03 축구용품점 유니사커',
              '03 서울우체국보험관리사협회',
              '03 (주)lg전자 프리젠테이션 플래시인트로',
              '03 개미집소프트',
              '02 화정박물관 (구)',
              '02 이미지컨트롤연구소',
              '02 정보통신공무원교육원',
              '02 하마노니 코리아',
              '02 (주)한국삼공',
              '01 마주이야기 교육연구소 디자이너',
              '98 춘천여행포탈 hobannet.com 현재폐쇠',
              '97 강원대학교 클래식기타 음악연구회',
              '97 carav닷컴',
              '그외 다수 프로젝트.',

            ].map((project, index) => (
              <div key={index} className="flex flex-col hover:border-green-400 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-0.5 bg-green-400 rounded-full shrink-0"></div>
                  <p className="text-gray-300 text-xs leading-tight">{project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 재직경력 */}
        <div className="border-t border-gray-800 pt-4 mt-8">
          <h3 className="text-lg font-bold mb-3 text-white">재직경력</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {[
              '(주)kitvalley 디자인팀장(www.kitvalley.com)',
              '코메프리마 디자인 대표',
            ].map((career, index) => (
              <div key={index} className="flex flex-col hover:border-green-400 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-0.5 bg-green-400 rounded-full shrink-0"></div>
                  <p className="text-gray-300 text-xs leading-tight">{career}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 수상경력 */}
        <div className="border-t border-gray-800 pt-4 mt-8">
          <h3 className="text-lg font-bold mb-3 text-white">수상경력</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {[
              'Educom98 홈페이지경연대회 3위',
              '강원대학교 총장 특별상(98)',
              '강원대학교 총장 공로상(01)',
            ].map((award, index) => (
              <div key={index} className="flex flex-col hover:border-green-400 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-0.5 bg-green-400 rounded-full shrink-0"></div>
                  <p className="text-gray-300 text-xs leading-tight">{award}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


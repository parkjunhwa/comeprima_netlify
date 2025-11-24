'use client';

export default function HeroSection() {

  return (
    <div className="h-full w-full flex items-center justify-center px-8 relative overflow-hidden">
      {/* 배경 블러 이미지 효과 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-md opacity-30 hero-background"
      />



      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-4xl text-center">
        {/* 연도 표시 */}
        <p className="text-sm text-gray-500 tracking-widest mb-8 uppercase">
          Since 2007 - Now
        </p>

        {/* 메인 제목 */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
          <span className="block text-white mb-2">당신의 아이디어를</span>
          <span className="neon-text text-6xl md:text-8xl">현실로</span>
          <span className="block text-white mt-2">만드는 디자인</span>
        </h1>

        {/* 설명 텍스트 */}
        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-20 font-light">
          우리는 사용자 경험을 기획하고 디자인하며, 프로토타입의 흐름, 개발하여
          <br />
          실현시켜내는 일을 좋아합니다.
          <br />
          <br />
          우리가 만들어낸 결과가
          <br />
          IT와 세상을 연결한다는 것을 확신합니다.
        </p>

        {/* 스크롤 힌트 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {/* 마우스 외형 */}
            <rect
              x="6"
              y="3"
              width="12"
              height="18"
              rx="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              fill="none"
            />
            {/* 마우스 휠 - 세로선 3개 */}
            <line
              x1="12"
              y1="6"
              x2="12"
              y2="9"
              strokeLinecap="round"
              strokeWidth={2}
            />
            <line
              x1="12"
              y1="9"
              x2="12"
              y2="12"
              strokeLinecap="round"
              strokeWidth={2}
            />
            <line
              x1="12"
              y1="12"
              x2="12"
              y2="15"
              strokeLinecap="round"
              strokeWidth={2}
            />
            {/* 마우스 휠 - 가로선 (휠 디테일) */}
            <circle
              cx="12"
              cy="10.5"
              r="1.5"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

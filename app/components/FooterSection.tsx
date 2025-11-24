'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface FooterSectionProps {
  sectionIndex: number;
  currentSection: number;
}

export default function FooterSection({ sectionIndex, currentSection }: FooterSectionProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const fullTitle = 'comeprima';
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

  const handleDownload = async (filename: string, displayName: string) => {
    setDownloading(filename);
    try {
      const response = await fetch(`/api/download-image?file=${filename}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="h-full w-full bg-black relative overflow-hidden flex flex-col justify-center right-menu-page-padding">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-1/2 left-1/3 w-80 h-80 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-3"></div>
      </div>

      <div className="max-w-6xl mx-auto px-8 lg:pr-24 relative z-10 w-full">
        {/* 상단 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-8 pb-8 border-b border-gray-800">
          {/* 브랜드 */}
          <div>
            <h3 className="text-2xl font-bold mb-4 relative" ref={titleRef}>
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
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              당신의 아이디어를 현실로 만드는
              <br/>
              디자인 에이전시
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-widest">
              Services
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                  UI/UX Design
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                  Branding
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                  Consulting
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-6 uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="text-sm text-gray-400">
                업무전화:
                <br/>
                <a href="tel:0704152318" className="text-green-400 hover:text-green-300">
                  070 4152 3188
                </a>
              </li>
              <li className="text-sm text-gray-400">
                휴대폰:
                <br/>
                <a href="tel:01094793188" className="text-green-400 hover:text-green-300">
                  010 9479 3188
                </a>
              </li>
              <li className="text-sm text-gray-400">
                팩스:
                <br/>
                <span className="text-gray-500">031 601 8484</span>
              </li>
              <li className="text-sm text-gray-400">
                Email:
                <br/>
                <a href="mailto:admin@comeprima.co.kr" className="text-green-400 hover:text-green-300">
                  admin@comeprima.co.kr
                </a>
              </li>
              <li className="text-sm text-gray-400">
                Location:
                <br/>
                <span className="text-gray-500">Seoul, Korea</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-xs text-gray-600">
            © 2026 Comeprima. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => handleDownload('company.jpeg', '사업자등록증')}
              disabled={downloading !== null}
              className="text-xs text-gray-600 hover:text-green-400 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading === 'company.jpeg' ? '다운로드 중...' : '사업자등록증'}
            </button>
            <button
              onClick={() => handleDownload('kosa.pdf', 'KOSA경력인증서')}
              disabled={downloading !== null}
              className="text-xs text-gray-600 hover:text-green-400 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading === 'kosa.pdf' ? '다운로드 중...' : 'KOSA경력인증서'}
            </button>
            <button
              onClick={() => handleDownload('woori.png', '입금용계좌통장사본')}
              disabled={downloading !== null}
              className="text-xs text-gray-600 hover:text-green-400 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading === 'woori.png' ? '다운로드 중...' : '입금용계좌통장사본'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

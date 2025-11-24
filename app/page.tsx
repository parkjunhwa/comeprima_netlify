'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Circle, Menu, X } from 'lucide-react';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import GallerySection from './components/GallerySection';
import NoticesSection from './components/NoticesSection';
import FooterSection from './components/FooterSection';

export default function Home() {
  const [showFixedNav, setShowFixedNav] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      // 스크롤 임계값: 50 이상의 스크롤만 감지 (민감도 조절)
      if (Math.abs(e.deltaY) < 50) {
        return;
      }

      setIsScrolling(true);
      e.preventDefault();
      
      const viewportHeight = window.innerHeight;
      const currentScroll = window.scrollY;
      const currentSection = Math.round(currentScroll / viewportHeight);
      
      let nextSection = currentSection;
      if (e.deltaY > 0) {
        nextSection = currentSection + 1;
      } else if (e.deltaY < 0) {
        nextSection = Math.max(0, currentSection - 1);
      }

      // 다음 섹션으로 부드럽게 스크롤
      window.scrollTo({
        top: nextSection * viewportHeight,
        behavior: 'smooth',
      });

      // 즉시 스크롤 가능하게
      setIsScrolling(false);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const section = Math.floor(scrollTop / viewportHeight);
      
      setCurrentSection(section);
      
      // 2페이지(Gallery) 이후에 고정 메뉴 표시
      const shouldShow = section >= 1;
      
      if (shouldShow && !showFixedNav) {
        setIsHiding(false);
        setShowFixedNav(true);
      } else if (!shouldShow && showFixedNav) {
        setIsHiding(true);
        // 애니메이션 완료 후 메뉴 숨김
        setTimeout(() => {
          setShowFixedNav(false);
          setIsHiding(false);
        }, 400);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling, showFixedNav]);

  const menuItems = [
    { href: '#home', label: 'Home', section: 0 },
    { href: '#about', label: 'About Us', section: 1 },
    { href: '#services', label: 'Services', section: 2 },
    { href: '#gallery', label: 'Gallery', section: 3 },
    { href: '#notices', label: 'Notices', section: 4 },
    { href: '#info', label: 'Info', section: 5 },
  ];

  const handleMenuClick = (sectionIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: sectionIndex * viewportHeight,
      behavior: 'smooth',
    });
  };

  return (
    <main className="bg-black text-white">
      {/* 데스크톱 고정 메뉴 (2페이지부터 우측에 세로 표시, lg 이상) */}
      {showFixedNav && (
        <nav className={`hidden lg:fixed lg:top-1/2 lg:right-8 lg:z-50 lg:flex flex-col gap-2 ${isHiding ? 'animate-slide-out' : 'animate-slide-in'}`}>
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => handleMenuClick(item.section, e)}
              className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {currentSection === item.section ? (
                  <Circle size={6} fill="currentColor" className="text-green-400" />
                ) : (
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className="text-right">{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* 모바일 햄버거 메뉴 (lg 미만) */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 p-2 text-gray-400 hover:text-green-400 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 모바일 메뉴 드롭다운 (lg 미만) */}
      {mobileMenuOpen && (
        <nav className="lg:hidden fixed top-16 right-6 z-50 flex flex-col gap-4 bg-black border border-gray-800 rounded-lg p-4 w-48 animate-slide-in-down">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => {
                handleMenuClick(item.section, e);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 text-sm font-medium transition-colors uppercase tracking-wider cursor-pointer ${
                currentSection === item.section
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-green-400'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {currentSection === item.section ? (
                  <Circle size={6} fill="currentColor" className="text-green-400" />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Hero Section */}
      <section id="home" className="section w-full bg-black">
        <HeroSection />
      </section>

      {/* About Section */}
      <section id="about" className="section w-full bg-black">
        <AboutSection sectionIndex={1} currentSection={currentSection} />
      </section>

      {/* Services Section */}
      <section id="services" className="section w-full bg-black">
        <ServicesSection sectionIndex={2} currentSection={currentSection} />
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section w-full bg-black">
        <GallerySection sectionIndex={3} currentSection={currentSection} />
      </section>

      {/* Notices Section */}
      <section id="notices" className="section w-full bg-black">
        <NoticesSection sectionIndex={4} currentSection={currentSection} />
      </section>

      {/* Footer Section */}
      <section id="info" className="section w-full bg-black">
        <FooterSection sectionIndex={5} currentSection={currentSection} />
      </section>
    </main>
  );
}

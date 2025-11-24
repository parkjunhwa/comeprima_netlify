'use client';

import { useEffect, useState } from 'react';

export default function FloatingNeonDots() {
  const [neonDots, setNeonDots] = useState<Array<{id: number; x: number; y: number; duration: number; opacity: number; size: number}>>([]);

  useEffect(() => {
    // 60개의 네온 점 생성
    const dots = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 6 + Math.random() * 6, // 6~12초
      opacity: 0.1 + Math.random() * 0.2, // 0.1~0.3
      size: 1 + Math.random() * 7, // 1~8px
    }));
    setNeonDots(dots);
  }, []);

  return (
    <>
      {/* 부유하는 네온 점들 */}
      {neonDots.map((dot) => (
        <div
          key={dot.id}
          className="neon-dot animate-float"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDuration: `${dot.duration}s`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: dot.opacity,
            boxShadow: `0 0 ${dot.size * 2.5}px var(--primary), 0 0 ${dot.size * 5}px var(--primary)`,
          }}
        />
      ))}
    </>
  );
}


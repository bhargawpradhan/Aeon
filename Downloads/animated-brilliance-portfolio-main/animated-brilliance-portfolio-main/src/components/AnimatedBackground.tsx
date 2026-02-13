// src/components/AnimatedBackground.tsx
import { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import animeChar1 from '@/assets/anime-char-1.png';
import animeChar2 from '@/assets/anime-char-2.png';
import animeChar3 from '@/assets/anime-char-3.png';
import animeChar4 from '@/assets/anime-char-4.png';
import animeChar5 from '@/assets/anime-char-5.png';
import animeChar6 from '@/assets/anime-char-6.png';

const CHARACTERS = [animeChar1, animeChar2, animeChar3, animeChar4, animeChar5, animeChar6];

const JAPANESE_TEXTS = [
  '開発者', 'プログラマー', 'デザイナー', 'エンジニア', 'クリエイター',
  'フロントエンド', 'バックエンド', 'フルスタック', 'モバイル', 'ウェブ',
  'コード', 'アプリ', 'サイト', 'ポートフォリオ', 'プロジェクト',
  'テクノロジー', 'イノベーション', 'クリエイティブ', 'ソリューション',
  'パフォーマンス', 'ユーザー', 'エクスペリエンス', 'デザイン', 'アート',
  '夢', '未来', '力', '光', '影', '魂', '星', '風', '火', '雷'
];

const KANJI_RAIN_CHARS = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖', '拾', '百', '千', '万', '億'];

// Pre-generate random values for consistency
const generateRandomValues = (count: number) => {
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      fontWeight: Math.random() > 0.5 ? 300 : 500,
      rotate: Math.random() * 360,
    });
  }
  return values;
};

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 0.6, 0.6, 0.3]);

  // Particle system
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number; y: number; size: number;
    speedX: number; speedY: number; color: string;
    type: 'circle' | 'square' | 'triangle';
  }>>([]);

  // Pre-generate random values with useMemo to avoid re-renders
  const jpTextValues = useMemo(() => generateRandomValues(18), []);
  const shapeValues = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      size: Math.random() * 30 + 10,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
    }));
  }, []);
  const dotValues = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
  }, []);

  // Anime elements pre-computed
  const shurikenValues = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      top: 15 + i * 22,
      delay: i * 4,
      duration: 18 + i * 3,
      size: 20 + Math.random() * 15,
    }));
  }, []);
  const sakuraValues = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      left: 5 + i * 12,
      delay: i * 1.5,
      duration: 8 + Math.random() * 6,
      size: 8 + Math.random() * 10,
    }));
  }, []);
  const orbValues = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      left: 10 + i * 18,
      top: 20 + (i % 3) * 25,
      delay: i * 2,
      duration: 6 + Math.random() * 4,
      size: 6 + Math.random() * 8,
      hue: 180 + i * 30,
    }));
  }, []);
  const kanjiRainValues = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      left: 8 + i * 16,
      delay: i * 2.5,
      duration: 10 + Math.random() * 5,
      chars: Array.from({ length: 8 }, () =>
        KANJI_RAIN_CHARS[Math.floor(Math.random() * KANJI_RAIN_CHARS.length)]
      ),
    }));
  }, []);
  const speedLineValues = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      top: 20 + i * 20,
      delay: i * 3 + 1,
      duration: 2 + Math.random() * 2,
      width: 100 + Math.random() * 200,
    }));
  }, []);
  const chakraValues = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      left: 20 + i * 30,
      top: 30 + i * 15,
      delay: i * 3,
      size: 40 + i * 20,
    }));
  }, []);

  const characterDriftValues = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      left: Math.random() * 100, // Anywhere horizontal
      top: Math.random() * 100, // Anywhere vertical
      delay: i * 3,
      duration: 25 + Math.random() * 20, // Even slower for the large distances
      hue: i * 30,
      scale: 0.5 + Math.random() * 0.5,
      direction: i % 2 === 0 ? 1 : -1,
      charIndex: i % CHARACTERS.length,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < particleCount; i++) {
        const types: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${Math.random() * 0.1 + 0.05})`,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
    };

    const drawTriangle = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x - size, y + size);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        ctx.fillStyle = particle.color;
        switch (particle.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2);
            break;
          case 'triangle':
            drawTriangle(particle.x, particle.y, particle.size);
            break;
        }
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden" style={{ opacity: opacity as any }}>
      {/* Background Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Layer 0: Gradient overlay and base atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-gray-900/95 shadow-inner" />

      {/* Canvas for particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />

      {/* Layer 1: Floating Japanese text */}
      <div className="absolute inset-0 overflow-hidden">
        {jpTextValues.map((val, i) => (
          <motion.span
            key={`jp-${i}`}
            className={`absolute text-gray-400/20 font-japanese select-none ${val.fontWeight === 300 ? 'font-light' : 'font-medium'}`}
            style={{
              fontSize: `${val.size}rem`,
              left: `${val.left}%`,
              top: `${val.top}%`,
              y: y1,
              rotate: val.rotate,
              animation: `float ${val.duration}s ease-in-out ${val.delay}s infinite alternate`
            }}
          >
            {JAPANESE_TEXTS[i % JAPANESE_TEXTS.length]}
          </motion.span>
        ))}
      </div>

      {/* Layer 2: Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {shapeValues.map((val, i) => (
          <motion.div
            key={`shape-${i}`}
            className={`absolute bg-purple-500/10 ${val.shape === 'circle' ? 'rounded-full' : val.shape === 'square' ? '' : 'rotate-45'
              }`}
            style={{
              width: `${val.size}px`,
              height: `${val.size}px`,
              left: `${val.left}%`,
              top: `${val.top}%`,
              y: y2,
              animation: `float ${val.duration}s ease-in-out ${val.delay}s infinite alternate-reverse`
            }}
          />
        ))}
      </div>

      {/* Layer 3: Small dots */}
      <div className="absolute inset-0 overflow-hidden">
        {dotValues.map((val, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute bg-cyan-400/20 rounded-full"
            style={{
              width: `${val.size}px`,
              height: `${val.size}px`,
              left: `${val.left}%`,
              top: `${val.top}%`,
              y: y3,
              animation: `float ${val.duration}s ease-in-out ${val.delay}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Layer 4: Energy Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${20 + i * 15}%`,
              background: `linear-gradient(90deg, transparent, rgba(0, 255, 255, ${0.1 + i * 0.05}), transparent)`,
            }}
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Layer 5: Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '0, 255, 255' : '255, 0, 255'}, 0.3), transparent)`,
              filter: 'blur(10px)'
            }}
            animate={{
              y: [0, -50 - Math.random() * 100, 0],
              x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * -100, (Math.random() - 0.5) * 100],
              scale: [1, 1.5 + Math.random(), 1],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Layer 6: Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => {
          const shapeType = i % 3;
          return (
            <motion.div
              key={`geo-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${15 + Math.random() * 25}px`,
                height: `${15 + Math.random() * 25}px`,
                border: `1px solid rgba(${shapeType === 0 ? '0, 255, 255' : shapeType === 1 ? '255, 0, 255' : '139, 92, 246'}, 0.15)`,
                borderRadius: shapeType === 0 ? '50%' : shapeType === 1 ? '0%' : '10%',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 20 + Math.random() * 15,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      {/* ===== NEW ANIME ANIMATIONS ===== */}

      {/* Anime Element 1: Floating Shuriken Stars ⊛ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shurikenValues.map((val, i) => (
          <motion.div
            key={`shuriken-${i}`}
            className="absolute text-cyan-400/20"
            style={{
              top: `${val.top}%`,
              left: '-60px',
              fontSize: `${val.size}px`,
              animation: `driftAcross ${val.duration}s linear ${val.delay}s infinite`,
            }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              ✦
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Anime Element 2: Sakura Petals 🌸 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sakuraValues.map((val, i) => (
          <motion.div
            key={`sakura-${i}`}
            className="absolute"
            style={{
              left: `${val.left}%`,
              top: '-20px',
              width: `${val.size}px`,
              height: `${val.size}px`,
              animation: `sakuraFall ${val.duration}s ease-in-out ${val.delay}s infinite`,
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(ellipse at 30% 30%, rgba(255, 183, 197, 0.6), rgba(255, 105, 135, 0.2))`,
                borderRadius: '50% 0 50% 50%',
                transform: 'rotate(45deg)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Anime Element 3: Energy Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbValues.map((val, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${val.left}%`,
              top: `${val.top}%`,
              width: `${val.size}px`,
              height: `${val.size}px`,
              background: `radial-gradient(circle, hsla(${val.hue}, 100%, 70%, 0.4), transparent)`,
              boxShadow: `0 0 ${val.size * 2}px hsla(${val.hue}, 100%, 60%, 0.3)`,
              animation: `spiralFloat ${val.duration}s ease-in-out ${val.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Anime Element 4: Kanji Rain Columns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {kanjiRainValues.map((val, i) => (
          <div
            key={`kanji-col-${i}`}
            className="absolute flex flex-col gap-2"
            style={{
              left: `${val.left}%`,
              top: '-100px',
              animation: `kanjiRain ${val.duration}s linear ${val.delay}s infinite`,
            }}
          >
            {val.chars.map((char, j) => (
              <span
                key={j}
                className="text-cyan-400/15 font-japanese text-sm select-none"
                style={{ animationDelay: `${j * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Anime Element 5: Speed Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {speedLineValues.map((val, i) => (
          <motion.div
            key={`speed-${i}`}
            className="absolute h-[1px]"
            style={{
              top: `${val.top}%`,
              left: 0,
              width: `${val.width}px`,
              background: `linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)`,
              animation: `speedLine ${val.duration}s ease-in-out ${val.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Anime Element 6: Chakra Spiral Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {chakraValues.map((val, i) => (
          <motion.div
            key={`chakra-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${val.left}%`,
              top: `${val.top}%`,
              width: `${val.size}px`,
              height: `${val.size}px`,
              border: '1px solid rgba(0, 255, 255, 0.1)',
              animation: `chakraSpin ${6 + i * 2}s linear ${val.delay}s infinite`,
            }}
          >
            <div
              className="absolute inset-2 rounded-full"
              style={{ border: '1px solid rgba(255, 0, 255, 0.08)' }}
            />
            <div
              className="absolute inset-4 rounded-full"
              style={{ border: '1px solid rgba(139, 92, 246, 0.06)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Anime Element 7: Drifting Character Variants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {characterDriftValues.map((val, i) => (
          <motion.div
            key={`char-drift-${i}`}
            className="absolute z-20 pointer-events-auto cursor-none" // Enable interaction
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('anime-hover-start'))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent('anime-hover-end'))}
            style={{
              left: `${val.left}%`,
              top: `${val.top}%`,
              filter: `hue-rotate(${val.hue}deg) brightness(1.2) drop-shadow(0 0 20px rgba(0, 255, 255, 0.4))`,
              scale: val.scale,
              opacity: 0.4,
            }}
          >
            <motion.img
              src={CHARACTERS[val.charIndex]}
              alt="Character"
              className="w-56 h-56 object-contain"
              animate={{
                // "Universal World Tour" - Crossing the entire view
                x: [
                  '-40vw',
                  '140vw',
                  '50vw',
                  '-60vw',
                  '0'
                ],
                y: [
                  '0',
                  '80vh',
                  '-30vh',
                  '60vh',
                  '0'
                ],
                rotate: [0, 90, -90, 180, 0],
                scale: [1, 1.25, 0.75, 1.15, 1],
              }}
              transition={{
                duration: val.duration * 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default AnimatedBackground;
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import animeCharacter from "@/assets/anime-character.png";

const floatingKanji = [
  { char: "ようこそ", x: "5%", y: "15%", size: "3rem", delay: 0, depth: 50 },
  { char: "コード", x: "85%", y: "25%", size: "2.5rem", delay: 1, depth: 80 },
  { char: "未来", x: "75%", y: "80%", size: "4rem", delay: 2, depth: 30 },
  { char: "創造", x: "10%", y: "75%", size: "2rem", delay: 0.5, depth: 60 },
  { char: "夢", x: "45%", y: "85%", size: "3.5rem", delay: 1.5, depth: 40 },
  { char: "力", x: "90%", y: "60%", size: "2.8rem", delay: 3, depth: 70 },
  { char: "技術", x: "15%", y: "45%", size: "2rem", delay: 2.5, depth: 55 },
  { char: "魂", x: "60%", y: "10%", size: "3rem", delay: 0.8, depth: 45 },
];

const HeroSection = () => {
  const [time, setTime] = useState(new Date());
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D rotation based on mouse position
  const rotateX = useTransform(mouseY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid-pattern"
      style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
    >
      {/* Floating particles - increased density and variance */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Japanese background text - large watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="jp-text text-[20rem] font-bold text-foreground">
          開発者
        </span>
      </motion.div>

      {/* Floating Japanese characters with 3D parallax */}
      {floatingKanji.map((k, i) => (
        <motion.span
          key={`hero-kanji-${i}`}
          className="absolute jp-text text-cyan-400/10 select-none pointer-events-none font-bold"
          style={{
            left: k.x,
            top: k.y,
            fontSize: k.size,
            transformStyle: 'preserve-3d',
            x: useTransform(mouseX, [0, window.innerWidth], [-k.depth * 0.3, k.depth * 0.3]),
            y: useTransform(mouseY, [0, window.innerHeight], [-k.depth * 0.2, k.depth * 0.2]),
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [0.9, 1.1, 0.9],
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            rotateX: [0, 10, -10, 0],
            rotateY: [0, -10, 10, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: k.delay,
            ease: "easeInOut",
          }}
        >
          {k.char}
        </motion.span>
      ))}

      {/* Animated speed lines behind content */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`hero-speed-${i}`}
          className="absolute h-[1px] pointer-events-none"
          style={{
            top: `${30 + i * 15}%`,
            left: 0,
            right: 0,
            background: `linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.15), transparent)`,
          }}
          animate={{
            x: ["-100%", "100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Live System Stats */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <div className="flex flex-col gap-1 px-4 py-2 bg-card/40 backdrop-blur-md rounded-lg border border-primary/10">
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground">Local Time</span>
              <span className="font-display text-sm text-primary tracking-widest">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="flex flex-col gap-1 px-4 py-2 bg-card/40 backdrop-blur-md rounded-lg border border-secondary/10">
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground">Uptime</span>
              <span className="font-display text-sm text-secondary tracking-widest">99.9%</span>
            </div>
            <div className="flex flex-col gap-1 px-4 py-2 bg-card/40 backdrop-blur-md rounded-lg border border-accent/10">
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground">Status</span>
              <span className="font-display text-sm text-accent tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                ACTIVE
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-body text-secondary text-lg tracking-[0.3em] uppercase mb-4"
          >
            Welcome to my world
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ delay: 0.7, duration: 4, repeat: Infinity }}
            className="jp-text text-primary/30 text-sm tracking-widest mb-2"
          >
            私の世界へようこそ
          </motion.p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-foreground block"
            >
              Hi, I'm{" "}
              <motion.span
                className="gradient-text inline-block glitch-text"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                BHARGAW
              </motion.span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-foreground block"
            >
              <span className="gradient-text">Creative</span> Developer
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-body text-muted-foreground text-lg max-w-md mb-8 leading-relaxed"
          >
            Crafting digital experiences with passion, code, and a touch of anime magic.
            Building the future, one pixel at a time.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2 }}
            className="jp-text text-muted-foreground/30 text-xs mb-4"
          >
            情熱とコードとアニメの魔法でデジタル体験を創造する
          </motion.p>

          {/* Typewriter Terminal effect */}
          <div className="flex items-center gap-2 font-mono text-xs text-primary/60 mb-8 px-4 py-2 bg-black/20 rounded border border-primary/5">
            <span className="text-secondary">&gt;</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-4 bg-primary"
            />
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 2, delay: 1.5 }}
              className="overflow-hidden whitespace-nowrap"
            >
              INITIALIZING_CREATIVE_SYSTEM_V3.0..._
            </motion.span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(185, 100%, 50%, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider rounded-lg box-glow-cyan"
            >
              VIEW PROJECTS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(320, 100%, 60%, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("cv")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 border border-secondary/50 text-secondary font-display text-sm tracking-wider rounded-lg hover:bg-secondary/10 transition-colors"
            >
              MY CV
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Anime Character with 3D Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative flex justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D Rotating Rings with depth */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-primary/20"
            style={{ translateZ: '50px' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border border-secondary/20"
            style={{ translateZ: '30px' }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-accent/10"
            style={{ translateZ: '10px' }}
          />

          {/* 3D Profile Card with mouse tracking */}
          <motion.div
            className="relative pointer-events-auto cursor-pointer z-30"
            style={{
              transformStyle: 'preserve-3d',
              rotateX: useTransform(mouseY, [0, window.innerHeight], [10, -10]),
              rotateY: useTransform(mouseX, [0, window.innerWidth], [-10, 10]),
              translateZ: '80px',
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              scale: 1.6,
              zIndex: 50,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent('anime-hover-start'))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent('anime-hover-end'))}
          >
            <motion.div
              className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden anime-border box-glow-cyan"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 20px 60px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)'
              }}
            >
              <img
                src={animeCharacter}
                alt="Anime character developer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>

            {/* Japanese label with 3D depth */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-card/80 rounded-lg anime-border"
              style={{ translateZ: '40px' }}
            >
              <span className="jp-text text-xs text-accent/70">クリエイター</span>
            </motion.div>

            {/* Status badge with 3D depth */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 10px rgba(0,255,0,0.2)", "0 0 20px rgba(0,255,0,0.5)", "0 0 10px rgba(0,255,0,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-card rounded-full anime-border"
              style={{ translateZ: '60px' }}
            >
              <span className="font-body text-sm text-neon-green flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green" />
                Available for hire
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        <span className="jp-text text-[10px] text-muted-foreground/50">下にスクロール</span>
        <div className="w-5 h-8 border border-primary/30 rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

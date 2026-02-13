// src/components/AnimatedSection.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

const sectionKanji = ['技', '夢', '光', '星', '風', '力', '道', '心'];

const AnimatedSection = ({
  children,
  id,
  className = '',
  delay = 0
}: AnimatedSectionProps) => {
  const kanjiIndex = Math.floor(Math.random() * sectionKanji.length);

  return (
    <motion.section
      id={id}
      className={`relative py-20 md:py-32 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 10 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: 1,
          ease: [0.34, 1.56, 0.64, 1],
          delay
        }
      }}
      viewport={{ once: true, margin: "-10%" }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-transparent" />

        {/* Animated grid lines overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Floating Purple orb */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Cyan orb */}
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Floating kanji particle - Multiple */}
        <motion.span
          className="absolute top-16 right-20 jp-text text-primary/10 text-7xl font-bold select-none pointer-events-none neon-flicker"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {sectionKanji[kanjiIndex]}
        </motion.span>

        {/* Small animated dots - Density increased */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sec-dot-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 2, 1],
              filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </motion.section>
  );
};

export default AnimatedSection;
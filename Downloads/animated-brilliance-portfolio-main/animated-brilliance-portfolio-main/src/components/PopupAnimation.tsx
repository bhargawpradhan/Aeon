// src/components/PopupAnimation.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PopupAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'burst';
  className?: string;
}

const PopupAnimation = ({
  children,
  delay = 0,
  direction = 'up',
  className = ''
}: PopupAnimationProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 80, scale: 0.85, rotate: -3 };
      case 'down': return { y: -80, scale: 0.85, rotate: 3 };
      case 'left': return { x: 80, scale: 0.85, rotate: 2 };
      case 'right': return { x: -80, scale: 0.85, rotate: -2 };
      case 'burst': return { scale: 0, rotate: -15 };
      default: return { y: 80, scale: 0.85, rotate: -3 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration: 0.7,
          ease: [0.34, 1.56, 0.64, 1], // Bounce overshoot easing
          delay
        }
      }}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
};

export default PopupAnimation;
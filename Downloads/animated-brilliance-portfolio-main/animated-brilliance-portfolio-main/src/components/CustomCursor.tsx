import { useEffect, useRef, useState } from "react";

interface TrailDot {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  scale: number;
  rotation: number;
  char?: string;
}

const JAPANESE_CHARS = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'デ', 'ザ', 'イ', 'ン'];

const COLORS = [
  "hsl(185, 100%, 60%)",
  "hsl(320, 100%, 70%)",
  "hsl(270, 100%, 70%)",
  "hsl(25, 100%, 65%)",
  "hsl(150, 100%, 60%)",
  "hsl(45, 100%, 60%)",
  "hsl(200, 100%, 60%)",
];

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailDot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const [isStopped, setIsStopped] = useState(false);
  const [isAnimeHover, setIsAnimeHover] = useState(false);
  const lastMoveTime = useRef(Date.now());
  const circleFormation = useRef(false);
  const circleCenter = useRef({ x: 0, y: 0 });
  const circleRadius = useRef(100);

  useEffect(() => {
    const handleAnimeStart = () => setIsAnimeHover(true);
    const handleAnimeEnd = () => setIsAnimeHover(false);

    window.addEventListener('anime-hover-start', handleAnimeStart);
    window.addEventListener('anime-hover-end', handleAnimeEnd);

    return () => {
      window.removeEventListener('anime-hover-start', handleAnimeStart);
      window.removeEventListener('anime-hover-end', handleAnimeEnd);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const getRandomChar = () => JAPANESE_CHARS[Math.floor(Math.random() * JAPANESE_CHARS.length)];

    const handleMouseMove = (e: MouseEvent) => {
      lastMoveTime.current = Date.now();
      if (isStopped) setIsStopped(false);

      mouseRef.current = { x: e.clientX, y: e.clientY };
      const trail = trailRef.current;
      const maxDots = 30; // Increased number of trail dots

      // Add new dot with random japanese character sometimes
      const shouldAddChar = Math.random() > 0.8;

      trail.unshift({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        size: 10 + Math.random() * 12, // Increased from 6+8
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        scale: 0.5 + Math.random(),
        rotation: Math.random() * Math.PI * 2,
        char: shouldAddChar ? getRandomChar() : undefined
      });

      if (trail.length > maxDots) trail.pop();
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if mouse stopped
      if (Date.now() - lastMoveTime.current > 1000 && !isStopped) {
        setIsStopped(true);
        circleFormation.current = true;
        circleCenter.current = { ...mouseRef.current };
        circleRadius.current = 100 + Math.random() * 100;
      }

      const trail = trailRef.current;

      // Draw background particles
      if (Math.random() > 0.9) {
        const size = Math.random() * 3;
        ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 80%, ${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Draw trail with smooth animation
      trail.forEach((dot, i) => {
        const progress = i / trail.length;
        const size = dot.size * (1 - progress * 0.7) * (isStopped ? 0.8 : 1);
        const alpha = 1 - progress * 0.8;

        // Calculate target position based on circle formation or normal trail
        let targetX = dot.x;
        let targetY = dot.y;

        if (isStopped && circleFormation.current) {
          const angle = (i / trail.length) * Math.PI * 2;
          targetX = circleCenter.current.x + Math.cos(angle) * circleRadius.current;
          targetY = circleCenter.current.y + Math.sin(angle) * circleRadius.current;

          // Smooth transition to circle formation
          dot.x += (targetX - dot.x) * 0.1;
          dot.y += (targetY - dot.y) * 0.1;

          // Add rotation
          dot.rotation += 0.02;
        } else {
          // Normal trail following
          const nextDot = trail[i - 1] || mouseRef.current;
          dot.x += (nextDot.x - dot.x) * 0.3;
          dot.y += (nextDot.y - dot.y) * 0.3;

          // Reset circle formation flag when moving
          if (circleFormation.current) {
            circleFormation.current = false;
          }
        }

        // Draw the dot
        ctx.save();
        ctx.translate(dot.x, dot.y);

        // Add pulsing effect when in circle formation
        if (isStopped) {
          const pulse = Math.sin(Date.now() * 0.005 + i) * 0.1 + 0.9;
          ctx.scale(pulse, pulse);
        }

        ctx.rotate(dot.rotation);

        // Draw circle or character
        if (dot.char && Math.random() > 0.7) {
          ctx.font = `${size * 1.5}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const charColor = `hsla(${Math.random() * 360}, 100%, 70%, ${alpha})`;
          ctx.fillStyle = charColor;
          ctx.shadowColor = charColor;
          ctx.shadowBlur = 10;
          ctx.fillText(dot.char, 0, 0);
        } else {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 2);
          const color1 = dot.color.replace(")", `, ${alpha})`).replace("hsl(", "hsla(");
          const color2 = dot.color.replace(")", `, ${alpha * 0.3})`).replace("hsl(", "hsla(");
          gradient.addColorStop(0, color1);
          gradient.addColorStop(1, color2);

          // Draw main circle
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();

          // Add glow effect
          ctx.shadowColor = dot.color;
          ctx.shadowBlur = size / 2;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Draw inner highlight
          const highlightGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 3);
          highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = highlightGradient;
          ctx.beginPath();
          ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Draw connecting lines between dots
        if (i > 0 && !isStopped) {
          const prevDot = trail[i - 1];
          const lineGradient = ctx.createLinearGradient(dot.x, dot.y, prevDot.x, prevDot.y);
          lineGradient.addColorStop(0, dot.color.replace(")", `, ${alpha * 0.5})`).replace("hsl(", "hsla("));
          lineGradient.addColorStop(1, prevDot.color.replace(")", `, ${alpha * 0.5})`).replace("hsl(", "hsla("));

          ctx.strokeStyle = lineGradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(prevDot.x, prevDot.y);
          ctx.stroke();
        }
      });

      // Main cursor dot with reduced hover effect
      if (trail.length > 0) {
        const baseRadius = 10;
        const hoverMultiplier = isAnimeHover ? 1 : 1; // Reduced from 4 to 1.5
        const radius = baseRadius * hoverMultiplier;

        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Substantial glow when hovering
        ctx.shadowColor = isAnimeHover ? "rgba(0, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = radius * (isAnimeHover ? 2 : 1.5);
        ctx.stroke();

        // Pulsing outer ring when hovering an anime character
        if (isAnimeHover) {
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, radius * (1.3 + Math.sin(Date.now() * 0.01) * 0.1), 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
          ctx.lineWidth = 3;
          ctx.stroke();

          // Additional magical particle burst effect when hovering
          if (Math.random() > 0.8) {
            trail.push({
              x: mouseRef.current.x + (Math.random() - 0.5) * 50,
              y: mouseRef.current.y + (Math.random() - 0.5) * 50,
              size: 4,
              color: "hsl(185, 100%, 70%)",
              alpha: 0.8,
              scale: 1,
              rotation: Math.random() * Math.PI,
            });
          }
        }
      }

      // Draw center point when in circle formation
      if (isStopped && circleFormation.current) {
        ctx.save();
        const pulse = Math.sin(Date.now() * 0.003) * 0.2 + 1;
        ctx.translate(circleCenter.current.x, circleCenter.current.y);
        ctx.scale(pulse, pulse);

        // Draw pulsing center circle
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
        centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();

        // Draw japanese character in center
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(JAPANESE_CHARS[Math.floor(Math.random() * JAPANESE_CHARS.length)], 0, 0);

        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Add click effect
    const handleClick = (e: MouseEvent) => {
      // Create ripple effect on click
      const ripple = {
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        alpha: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };

      const animateRipple = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace(')', `, ${ripple.alpha})`).replace('hsl(', 'hsla(');
        ctx.lineWidth = 2;
        ctx.stroke();

        ripple.radius += 5;
        ripple.alpha -= 0.02;

        if (ripple.alpha > 0) {
          requestAnimationFrame(animateRipple);
        }
      };

      animateRipple();
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animRef.current);
    };
  }, [isStopped]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      style={{
        mixBlendMode: 'screen',
        opacity: 0.9
      }}
    />
  );
};

export default CustomCursor;

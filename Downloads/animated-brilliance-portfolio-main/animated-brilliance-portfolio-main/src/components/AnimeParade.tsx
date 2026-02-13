import { motion, useSpring, useMotionValue } from "framer-motion";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import animeChar1 from "@/assets/anime-char-1.png";
import animeChar2 from "@/assets/anime-char-2.png";
import animeChar3 from "@/assets/anime-char-3.png";
import animeChar4 from "@/assets/anime-char-4.png";
import animeChar5 from "@/assets/anime-char-5.png";
import animeChar6 from "@/assets/anime-char-6.png";

const CHARACTERS = [animeChar1, animeChar2, animeChar3, animeChar4, animeChar5, animeChar6];

const REACTION_TEXTS = [
    "こんにちは！", "！？", "（＾∀＾）", "見つけた！", "すごいね！",
    "ふわふわ〜", "☆彡", "（´∀｀）", "ドキドキ", "ワクワク",
    "おーい！", "キラキラ", "ニャー！", "（＞ｗ＜）", "（✿◡‿◡）"
];

const CharacterInstance = ({ char }: { char: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [emote, setEmote] = useState("");
    const [evadeOffset, setEvadeOffset] = useState({ x: 0, y: 0 });
    const mousePos = useRef({ x: 0, y: 0 });
    const charRef = useRef<HTMLDivElement>(null);

    // Track mouse for evasion
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            if (charRef.current) {
                const rect = charRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = mousePos.current.x - centerX;
                const dy = mousePos.current.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const power = (150 - dist) / 150;
                    setEvadeOffset({
                        x: -dx * power * 0.8,
                        y: -dy * power * 0.8
                    });

                    if (dist < 80 && !emote) {
                        setEmote(REACTION_TEXTS[Math.floor(Math.random() * REACTION_TEXTS.length)]);
                        setTimeout(() => setEmote(""), 2000);
                    }
                } else {
                    setEvadeOffset({ x: 0, y: 0 });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [emote]);

    const handleClick = () => {
        setIsClicked(true);
        setEmote("わーい！");
        setTimeout(() => {
            setIsClicked(false);
            setEmote("");
        }, 1000);
    };

    return (
        <motion.div
            ref={charRef}
            className="absolute w-64 h-64 select-none cursor-none"
            initial={{
                left: `${char.startX}%`,
                top: `${char.startY}%`,
                opacity: 0,
                scale: char.scale
            }}
            animate={{
                left: char.startX < 0 ? "110%" : "-10%",
                top: [`${char.startY}%`, `${char.startY - 10}%`, `${char.startY + 10}%`, `${char.startY}%`],
                opacity: [0, char.opacity, char.opacity, 0],
                x: evadeOffset.x,
                y: evadeOffset.y,
                scale: isClicked ? char.scale * 1.5 : isHovered ? char.scale * 1.2 : char.scale,
                rotate: isClicked ? 360 : isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{
                left: {
                    duration: char.duration,
                    repeat: Infinity,
                    delay: char.delay,
                    ease: "linear",
                },
                top: {
                    duration: char.duration / 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
                opacity: {
                    duration: char.duration,
                    repeat: Infinity,
                    delay: char.delay,
                    times: [0, 0.1, 0.9, 1],
                },
                x: { type: "spring", stiffness: 100, damping: 10 },
                y: { type: "spring", stiffness: 100, damping: 10 },
                rotate: isClicked ? { duration: 0.5 } : { duration: 0.5, repeat: isHovered ? Infinity : 0 }
            }}
            onMouseEnter={() => {
                setIsHovered(true);
                window.dispatchEvent(new CustomEvent('anime-hover-start'));
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                window.dispatchEvent(new CustomEvent('anime-hover-end'));
            }}
            onClick={handleClick}
            style={{ pointerEvents: 'auto' }}
        >
            {emote && (
                <motion.div
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="bubble-speech"
                >
                    {emote}
                </motion.div>
            )}

            <img
                src={char.image}
                alt="Anime Character"
                className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(185,100,255,0.4)]"
                style={{
                    transform: char.startX < 0 ? 'scaleX(1)' : 'scaleX(-1)',
                    filter: isHovered ? `brightness(1.5) drop-shadow(0 0 35px rgba(0, 255, 255, 0.6))` : undefined
                }}
            />

            {/* Interactive indicator */}
            {isHovered && !isClicked && (
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-primary/30 rounded-full scale-50"
                />
            )}
        </motion.div>
    );
};

const AnimeParade = () => {
    const characters = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            image: CHARACTERS[i % CHARACTERS.length],
            startX: Math.random() > 0.5 ? -20 : 120,
            startY: 10 + Math.random() * 80,
            duration: 25 + Math.random() * 20,
            delay: i * 5,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.2 + Math.random() * 0.3,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {characters.map((char) => (
                <CharacterInstance key={char.id} char={char} />
            ))}
        </div>
    );
};

export default AnimeParade;

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Code, Palette, Zap, Globe, Database, Smartphone } from "lucide-react";

const skills = [
  { name: "React / Next.js", level: 95, icon: Code, color: "primary", desc: "Building modern web apps" },
  { name: "Node.js", level: 90, icon: Globe, color: "secondary", desc: "Server-side development" },
  { name: "JavaScript", level: 93, icon: Zap, color: "accent", desc: "Core programming language" },
  { name: "TypeScript", level: 92, icon: Zap, color: "primary", desc: "Type-safe development" },
  { name: "UI/UX Design", level: 88, icon: Palette, color: "secondary", desc: "Beautiful interfaces" },
  { name: "Full Stack", level: 85, icon: Globe, color: "accent", desc: "End-to-end solutions" },
  { name: "Database", level: 80, icon: Database, color: "primary", desc: "Data management" },
  { name: "Mobile Dev", level: 75, icon: Smartphone, color: "secondary", desc: "Cross-platform apps" },
];

const techStack = [
  { name: "React / Next.js", icon: Code, color: "text-primary" },
  { name: "Node.js", icon: Globe, color: "text-secondary" },
  { name: "JavaScript", icon: Zap, color: "text-accent" },
  { name: "UI/UX Design", icon: Palette, color: "text-secondary" },
  { name: "Database", icon: Database, color: "text-primary" },
  { name: "Mobile Dev", icon: Smartphone, color: "text-accent" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden"
      ref={ref}
      style={{ perspective: '2000px' }}
    >
      {/* Japanese watermarks */}
      <motion.span
        className="jp-watermark text-[12rem] -top-5 right-5"
        animate={{ opacity: [0.02, 0.05, 0.02], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        自己紹介
      </motion.span>
      <motion.span
        className="jp-watermark text-[7rem] bottom-10 left-5"
        animate={{ opacity: [0.02, 0.04, 0.02], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        才能
      </motion.span>

      {/* Floating anime decorative orbs */}
      <motion.div
        className="absolute top-20 right-20 w-3 h-3 rounded-full bg-cyan-400/30"
        animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.5, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 left-16 w-2 h-2 rounded-full bg-secondary/30"
        animate={{ y: [0, 20, 0], x: [0, -10, 0], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute top-40 left-1/3 w-4 h-4 rounded-full bg-accent/20"
        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-body text-secondary tracking-[0.3em] uppercase text-sm"
          >
            About Me · <span className="jp-text">自己紹介</span>
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text">
            Who Am I?
          </h2>
          <motion.p
            className="jp-text text-muted-foreground/40 text-sm mt-2"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            私は誰ですか？
          </motion.p>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              I'm a passionate full-stack developer who combines creativity with technical
              expertise to build exceptional digital experiences. With a love for anime and
              clean code, I bring a unique perspective to every project.
            </p>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              My journey in development started with curiosity and has evolved into a
              dedication to crafting pixel-perfect interfaces and robust backend systems.
              I believe in the power of great design and clean architecture.
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.4 } : {}}
              transition={{ delay: 1 }}
              className="jp-text text-sm text-primary/30 italic"
            >
              「情熱を持って、一つ一つのピクセルを大切に」
            </motion.p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { num: "6", label: "Projects", jp: "作品" },
                { num: "2+", label: "Years", jp: "年間" },
                { num: "∞", label: "Passion", jp: "情熱" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -5, translateZ: 20 }}
                  className="text-center p-4 rounded-xl bg-card anime-border hover:box-glow-cyan transition-all tilt-card"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="font-display text-2xl font-bold text-primary text-glow-cyan"
                  >
                    {stat.num}
                  </motion.div>
                  <div className="font-body text-sm text-muted-foreground mt-1">{stat.label}</div>
                  <div className="jp-text text-[10px] text-primary/30 mt-0.5">{stat.jp}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-3" id="skills">
                Skills & Expertise
                <span className="jp-text text-sm text-primary/40 font-normal">スキル</span>
              </h3>

              {/* 3D Rotating Tech Cube */}
              <motion.div
                className="relative w-24 h-24"
                style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
              >
                <motion.div
                  animate={{ rotateX: 360, rotateY: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Cube faces */}
                  {techStack.map((tech, i) => {
                    const rotations = [
                      { rotateY: 0, translateZ: 48 },      // front
                      { rotateY: 180, translateZ: 48 },    // back
                      { rotateY: 90, translateZ: 48 },     // right
                      { rotateY: -90, translateZ: 48 },    // left
                      { rotateX: 90, translateZ: 48 },     // top
                      { rotateX: -90, translateZ: 48 },    // bottom
                    ];
                    return (
                      <motion.div
                        key={i}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                        style={{
                          transform: `rotateY(${rotations[i].rotateY}deg) rotateX(${rotations[i].rotateX || 0}deg) translateZ(${rotations[i].translateZ}px)`,
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <tech.icon size={24} className={`mb-1 ${tech.color}`} />
                        <span className={`font-mono text-[10px] font-bold ${tech.color} opacity-80`}>{tech.name}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>

            {/* 3D Flip Cards for Skills */}
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, i) => {
                const isFlipped = flippedCards.has(i);
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 100 }}
                    className="relative h-32 cursor-pointer"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    onClick={() => {
                      const newFlipped = new Set(flippedCards);
                      if (isFlipped) newFlipped.delete(i);
                      else newFlipped.add(i);
                      setFlippedCards(newFlipped);
                    }}
                    whileHover={{ scale: 1.05, translateZ: 20 }}
                  >
                    <motion.div
                      className="relative w-full h-full"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      {/* Front Face */}
                      <motion.div
                        className="absolute inset-0 p-4 rounded-xl bg-card anime-border flex flex-col justify-between"
                        style={{
                          backfaceVisibility: 'hidden',
                          boxShadow: skill.color === "primary"
                            ? "0 10px 30px rgba(0, 255, 255, 0.2)"
                            : skill.color === "secondary"
                              ? "0 10px 30px rgba(255, 0, 255, 0.2)"
                              : "0 10px 30px rgba(139, 92, 246, 0.2)"
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                            className={`p-2 rounded-lg bg-muted ${skill.color === "primary" ? "text-primary" : skill.color === "secondary" ? "text-secondary" : "text-accent"}`}
                          >
                            <skill.icon size={20} />
                          </motion.div>
                          <span className="font-display text-xs text-primary">{skill.level}%</span>
                        </div>
                        <div>
                          <h4 className="font-body text-sm font-semibold text-foreground">{skill.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Click to flip</p>
                        </div>
                      </motion.div>

                      {/* Back Face */}
                      <motion.div
                        className="absolute inset-0 p-4 rounded-xl bg-gradient-to-br from-card to-muted anime-border flex flex-col justify-center items-center text-center"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          boxShadow: skill.color === "primary"
                            ? "0 10px 30px rgba(0, 255, 255, 0.3)"
                            : skill.color === "secondary"
                              ? "0 10px 30px rgba(255, 0, 255, 0.3)"
                              : "0 10px 30px rgba(139, 92, 246, 0.3)"
                        }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`text-4xl font-bold mb-2 ${skill.color === "primary" ? "text-primary" : skill.color === "secondary" ? "text-secondary" : "text-accent"}`}
                        >
                          {skill.level}%
                        </motion.div>
                        <p className="text-xs text-muted-foreground">{skill.desc}</p>
                        <div className="mt-3 w-full h-1 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full ${skill.color === "primary" ? "bg-primary" : skill.color === "secondary" ? "bg-secondary" : "bg-accent"}`}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

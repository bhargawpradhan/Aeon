import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import animeCharacter from "@/assets/anime-character.png";

const projects = [
  {
    title: "Alumni Fusion",
    description: "Alumni Fusion is a web-based platform that connects alumni and students for mentorship, networking, and sharing career opportunities, helping strengthen alumni–student engagement.",
    tech: ["React", "Node.js", "MongoDB", "PostgreSQL", "Express", "Socket.io"],
    color: "primary",
    github: "https://github.com/bhargawpradhan/AlumniFusion",
    live: "https://example.com",

  },
  {
    title: "Krish 2.O",
    description: "Krish 2.O is an intelligent virtual assistant designed to interact with users through voice or text, perform tasks, answer queries, and automate basic system or web operations using AI-based logic.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "Mongodb", "NLP (Basics)", "APIs", "Speech Recognition", "Automation Libraries"],
    color: "secondary",
    github: "https://github.com/bhargawpradhan/Krish-2.0",
    live: "https://example.com",

  },
  {
    title: "Astronomy Event Tracker",
    description: "Astronomy Event Tracker is a web-based application that provides real-time information about upcoming celestial events such as eclipses, meteor showers, and planetary alignments, helping users stay informed and plan observations.",
    tech: ["React Native", "Firebase", "GraphQL", "API", "Web Scraping"],
    color: "accent",
    github: "https://github.com/bhargawpradhan/Astronomy-Event-Tracker",
    live: "https://example.com",

  },
  {
    title: "Social Networking Connectivity",
    description: "Social Networking Connectivity is a web-based platform that enables users to connect, communicate, and share information in a secure and interactive online environment, focusing on user engagement and community building.",
    tech: ["Next.js", "WebSocket", "PostgreSQL", "DSA", "Authentication", "Authorization"],
    color: "primary",
    github: "https://github.com/bhargawpradhan/Social-Networking-Connectivity",
    live: "https://example.com",

  },
  {
    title: "Multi Tenant ink",
    description: "Multi-Tenant Link is a scalable application designed to support multiple organizations (tenants) within a single system, ensuring data isolation, secure access, and efficient resource sharing across tenants.",
    tech: ["Three.js", "GSAP", "React"],
    color: "secondary",
    github: "https://github.com/bhargawpradhan/multi-tenant-ink",
    live: "https://example.com",

  },
  {
    title: "Starry Sky Seeker Web",
    description: "Starry Sky Seeker Web is a web-based application that helps users explore the night sky by providing information about stars, constellations, and celestial events, making astronomy learning interactive and accessible.",
    tech: ["React", "D3.js", "Web3", "Node.js", "APIs", "Data Visualization"],
    color: "accent",
    github: "https://github.com/bhargawpradhan/starry-sky-seeker-web",
    live: "https://example.com",

  },
];

const ProjectCard = ({ project, index, angle, ringRadius, hoveredIndex, setHoveredIndex, setSelectedProject, isInView }) => {
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;
  const cardRef = useRef(null);

  // Mouse position relative to card for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.2, 0.8]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredIndex(null);
  };

  // Calculate position on ring
  const radian = (angle * Math.PI) / 180;
  const posX = Math.cos(radian) * ringRadius;
  const posY = Math.sin(radian) * ringRadius;



  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isInView ? (isAnyHovered && !isHovered ? 0.3 : 1) : 0,
        scale: isInView ? (isHovered ? 1.4 : 1) : 0,
        x: posX,
        y: posY,
        zIndex: isHovered ? 100 : 10
      }}
      transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedProject(index)}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -80, // half width
        marginTop: -80, // half height
      }}
      className="cursor-pointer"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          filter: `brightness(${isHovered ? 1.1 : 1})`,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-40 h-40 rounded-2xl bg-card/80 backdrop-blur-md border flex flex-col items-center justify-center p-4 transition-all duration-300 group ${isHovered
          ? project.color === "primary" ? "shadow-[0_0_50px_rgba(0,255,255,0.4)] border-primary"
            : project.color === "secondary" ? "shadow-[0_0_50px_rgba(255,0,255,0.4)] border-secondary"
              : "shadow-[0_0_50px_rgba(139,92,246,0.4)] border-accent"
          : "border-white/10 hover:border-white/30 shadow-lg"
          }`}
      >
        {/* Holographic Gradient Overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(125deg, transparent 10%, rgba(255,255,255,0.2) 30%, transparent 50%, rgba(255,255,255,0.1) 70%, transparent 90%)",
            mixBlendMode: "overlay",
            zIndex: 20,
          }}
        />

        {/* Floating Orb Background */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 ${project.color === "primary" ? "bg-primary" : project.color === "secondary" ? "bg-secondary" : "bg-accent"
          }`} />

        {/* Content Layer - Z-Index High */}
        <div className="relative z-30 flex flex-col items-center w-full" style={{ transform: "translateZ(30px)" }}>


          <div className={`font-display text-xs font-bold mb-2 text-center transition-all duration-300 ${isHovered
            ? project.color === "primary" ? "text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
              : project.color === "secondary" ? "text-secondary drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
                : "text-accent drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
            : "text-foreground"
            }`}>
            {project.title}
          </div>

          <p className="font-body text-[10px] text-muted-foreground text-center mb-3 line-clamp-2 px-1 leading-relaxed group-hover:text-foreground/80 transition-colors">
            {project.description}
          </p>

          <div className="flex gap-1.5 flex-wrap justify-center w-full">
            {project.tech.slice(0, 2).map((t) => (
              <span key={t} className="text-[8px] px-2 py-0.5 bg-background/50 backdrop-blur-sm rounded-full font-body text-muted-foreground border border-white/5 group-hover:border-white/20 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack Floating Behind */}
        {isHovered && (
          <div className="absolute inset-0 z-0 pointer-events-none" style={{ transform: "translateZ(-20px)" }}>
            {project.tech.slice(2, 5).map((t, i) => (
              <motion.div
                key={`float-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: [0, (i - 1) * 60],
                  y: [0, -60 - (i * 20)]
                }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 text-[9px] text-muted-foreground whitespace-nowrap"
              >
                {t}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>


    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const ringRadius = 260;

  // Global mouse tracking for section background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const backgroundX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const backgroundY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  return (
    <section id="projects" className="py-32 relative w-full overflow-hidden" ref={ref}>
      {/* Dynamic Background Mesh & Spotlight */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,0,255,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Interactive Spotlight */}
        <motion.div
          className="absolute w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"
          style={{
            x: backgroundX,
            y: backgroundY,
            translateX: "-50%",
            translateY: "-50%",
            top: 0,
            left: 0,
            position: "fixed" // Use fixed to follow across scroll, or absolute if relative to section
          }}
        />
      </div>

      {/* Japanese watermarks - Parallax */}
      <motion.div style={{ y: useTransform(useMotionValue(0), [0, 1], [0, 50]) }} className="absolute inset-0 pointer-events-none z-0">
        <motion.span
          className="jp-watermark text-[12rem] top-0 left-0 opacity-5"
          animate={{ x: [0, 20, 0], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          創造
        </motion.span>
        <motion.span
          className="jp-watermark text-[8rem] bottom-0 right-0 opacity-5"
          animate={{ x: [0, -20, 0], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          未来
        </motion.span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-32 relative"
        >
          {/* Glowing orbital ring around title */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute md:block hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[100px] rounded-[100%] border border-primary/20 blur-sm -z-10"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <span className="font-body text-secondary tracking-[0.3em] uppercase text-sm relative px-6 py-2 border border-secondary/20 rounded-full bg-secondary/5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,0,255,0.2)]">
              Portfolio · <span className="jp-text">作品集</span>
            </span>
          </motion.div>

          <h2 className="font-display text-5xl md:text-7xl font-bold mt-8 gradient-text drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] tracking-tight">
            Projects
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          />
        </motion.div>

        {/* Desktop 3D Ring Layout */}
        <div className="hidden lg:flex justify-center items-center relative h-[750px] perspective-[2000px]">
          {/* Central Energy Core */}
          <div className="absolute z-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-[500px] h-[500px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            {/* Rotating Tech Rings */}
            <motion.div
              animate={{ rotateX: [60, 70, 60], rotateZ: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/20 border-dashed"
            />
            <motion.div
              animate={{ rotateX: [60, 50, 60], rotateZ: [360, 0] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-secondary/20"
            />
          </div>

          {/* Central Stats Counter */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute text-center z-10 bg-black/40 backdrop-blur-md p-10 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group hover:scale-110 transition-transform duration-500"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:opacity-100 opacity-50 transition-opacity" />
            <div className="font-display text-8xl font-bold gradient-text relative z-10">{projects.length}</div>
            <div className="font-body text-xs tracking-[0.4em] text-muted-foreground uppercase mt-2 relative z-10">Projects</div>

            {/* Orbiting particles around center */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full rounded-full"
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_cyan]" />
            </motion.div>
          </motion.div>

          {/* Project Cards Ring */}
          {projects.map((project, i) => {
            const angle = (i * 360) / projects.length - 90;
            return (
              <ProjectCard
                key={i}
                project={project}
                index={i}
                angle={angle}
                ringRadius={ringRadius}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                setSelectedProject={setSelectedProject}
                isInView={isInView}
              />
            );
          })}
        </div>

        {/* Mobile Grid Layout */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-6 pb-20">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedProject(i)}
              className="p-6 rounded-2xl bg-card border border-white/10 relative overflow-hidden group active:scale-95 transition-transform"
            >
              <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${project.color === "primary" ? "bg-primary" : project.color === "secondary" ? "bg-secondary" : "bg-accent"
                } opacity-0 group-hover:opacity-100 shadow-[0_0_20px_currentColor]`} />

              {/* Background Glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${project.color === "primary" ? "from-primary to-transparent" : project.color === "secondary" ? "from-secondary to-transparent" : "from-accent to-transparent"
                }`} />

              <div className="font-display text-lg font-bold mb-2 flex items-center gap-2">
                {project.title}
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              <div className="flex gap-2 flex-wrap">
                {project.tech.map(t => (
                  <span key={t} className="text-xs bg-muted/50 px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal - Premium Design */}
        <AnimatePresence>
          {selectedProject !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-6"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="relative max-w-4xl w-full bg-card/95 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
                style={{ perspective: 1000 }}
              >
                {/* Modal Background Effect */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${projects[selectedProject].color === "primary" ? "from-primary/0 via-primary to-primary/0 shadow-[0_0_30px_cyan]"
                  : projects[selectedProject].color === "secondary" ? "from-secondary/0 via-secondary to-secondary/0 shadow-[0_0_30px_magenta]"
                    : "from-accent/0 via-accent to-accent/0 shadow-[0_0_30px_purple]"
                  }`} />

                <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 transition-colors z-20">
                  <X size={24} />
                </button>

                <div className="grid md:grid-cols-5 gap-0 h-full">
                  {/* Left Side: Visual */}
                  <div className="md:col-span-2 relative bg-black/20 min-h-[300px] flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className={`absolute w-[400px] h-[400px] rounded-full border border-dashed opacity-20 ${projects[selectedProject].color === "primary" ? "border-primary" : "border-secondary"
                        }`}
                    />

                    <motion.img
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={animeCharacter}
                      className="relative z-10 w-full h-full object-contain p-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    />
                  </div>

                  {/* Right Side: Content */}
                  <div className="md:col-span-3 p-8md:p-12 flex flex-col justify-center p-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${projects[selectedProject].color === "primary" ? "text-primary border-primary/30 bg-primary/10"
                          : "text-secondary border-secondary/30 bg-secondary/10"
                          }`}>
                          FEATURED PROJECT
                        </span>
                      </div>

                      <h3 className={`text-4xl md:text-5xl font-display font-bold mb-6 ${projects[selectedProject].color === "primary" ? "text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                        : projects[selectedProject].color === "secondary" ? "text-secondary drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                          : "text-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        }`}>
                        {projects[selectedProject].title}
                      </h3>

                      <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-white/10 pl-6">
                        {projects[selectedProject].description}
                      </p>

                      <div className="mb-10">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Technology Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {projects[selectedProject].tech.map((t, i) => (
                            <motion.span
                              key={t}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.05 }}
                              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors"
                            >
                              {t}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <a href={projects[selectedProject].github} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all group">
                          <Github size={20} className="group-hover:rotate-12 transition-transform" /> GitHub Code
                        </a>
                        <a href={projects[selectedProject].live} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-3 px-6 py-4 border border-white/20 rounded-xl font-bold hover:bg-white/5 hover:border-white/40 transition-all group">
                          <ExternalLink size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> Live Demo
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;

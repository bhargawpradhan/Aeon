import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Download, Eye, Briefcase, GraduationCap, Code, Trash2, X, FileText } from "lucide-react";
import animeCharacter from "@/assets/anime-char-1.png";

const cvData = {
  experience: [
    { role: "Software Developer", company: "Deloitte", period: "Sep-2025", desc: "Leading UI development for enterprise applications" },
    { role: "Full Stack Developer", company: "Hewlett Packard Enterprises", period: "Sep-2025", desc: "Built scalable web applications from scratch" },
  ],
  education: [
    { degree: "B.Tech ", school: "Lovely Professional University", year: "2023 - Present" },
    { degree: "Intermediate", school: "Sai Vidya Mandir , Baripada, Odisha", year: "2022-2023" },
    { degree: "Matriculation", school: "Saraswati Shishu Vidya Mandir , Baharagora , Jharkhand", year: "2020-2021" },
  ],
};

const CVSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mode, setMode] = useState<"animated" | "normal">("animated");
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedCv = localStorage.getItem("uploaded_cv");
    if (savedCv) setCvFile(savedCv);
  }, []);

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCvFile(result);
        localStorage.setItem("uploaded_cv", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCv = () => {
    setCvFile(null);
    localStorage.removeItem("uploaded_cv");
  };

  return (
    <section
      id="cv"
      className="py-32 relative overflow-hidden"
      ref={ref}
      style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
    >
      {/* Enhanced Japanese watermarks with 3D effect */}
      <motion.span
        className="jp-watermark text-[12rem] top-5 right-10"
        animate={{
          opacity: [0.02, 0.08, 0.02],
          rotateY: [0, 10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 9, repeat: Infinity }}
      >
        履歴書
      </motion.span>
      <motion.span
        className="jp-watermark text-[7rem] bottom-20 left-5"
        animate={{
          opacity: [0.02, 0.06, 0.02],
          rotateY: [0, -10, 0]
        }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        キャリア
      </motion.span>

      {/* Enhanced floating particles with trails */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? 'rgba(0, 255, 255, 0.3)' : i % 3 === 1 ? 'rgba(255, 0, 255, 0.3)' : 'rgba(139, 92, 246, 0.3)',
            boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 60, 0],
            scale: [1, 1.5 + Math.random(), 1],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Rotating rings */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border border-primary/10"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full border border-secondary/10"
        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="font-body text-secondary tracking-[0.3em] uppercase text-sm">
            Resume · <span className="jp-text">履歴書</span>
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text">My CV</h2>

          {/* Live Section Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-display text-primary/60 tracking-widest mb-1">Status</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[10px] font-mono text-neon-green uppercase tracking-tight">System Indexing...</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-display text-secondary/60 tracking-widest mb-1">Viewers</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/5 rounded-full border border-secondary/20">
                <span className="text-[10px] font-mono text-secondary uppercase tracking-tight">{viewers} ACTIVE</span>
              </div>
            </div>
          </div>

          <motion.p className="jp-text text-muted-foreground/40 text-sm mt-4" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>私の履歴書</motion.p>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-6" />
          {cvFile && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-body text-[10px] text-primary uppercase tracking-widest">CV Uploaded</span>
            </motion.div>
          )}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMode("animated")} className={`px-6 py-2 rounded-lg font-display text-sm tracking-wider transition-all ${mode === "animated" ? "bg-primary text-primary-foreground box-glow-cyan" : "bg-card text-muted-foreground anime-border"}`}>
              <Eye size={14} className="inline mr-2" />ANIMATED
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMode("normal")} className={`px-6 py-2 rounded-lg font-display text-sm tracking-wider transition-all ${mode === "normal" ? "bg-primary text-primary-foreground box-glow-cyan" : "bg-card text-muted-foreground anime-border"}`}>
              <Download size={14} className="inline mr-2" />NORMAL
            </motion.button>
          </div>
        </motion.div>

        {mode === "animated" ? (
          <div className="space-y-12">
            <div>
              <motion.h3 initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} className="font-display text-xl font-bold text-primary text-glow-cyan mb-8 flex items-center gap-3">
                <Briefcase size={20} /> Experience <span className="jp-text text-sm text-primary/30 font-normal">経験</span>
              </motion.h3>
              <div className="relative">
                <motion.div initial={{ height: 0 }} animate={isInView ? { height: "100%" } : {}} transition={{ duration: 1, delay: 0.5 }} className="absolute left-4 top-0 w-0.5 bg-primary/20" />
                {cvData.experience.map((exp, i) => (
                  <motion.div
                    key={exp.role}
                    initial={{ opacity: 0, x: -30, rotateY: -20 }}
                    animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 100 }}
                    className="relative pl-12 pb-8 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.8, rotate: 180 }}
                      className="absolute left-2 top-1 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(0, 255, 255, 0.4)",
                          "0 0 0 10px rgba(0, 255, 255, 0)",
                          "0 0 0 0 rgba(0, 255, 255, 0.4)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{
                        x: 12,
                        y: -8,
                        scale: 1.05,
                        rotateY: 5,
                        boxShadow: "0 20px 40px -15px rgba(0, 255, 255, 0.5)"
                      }}
                      className="p-5 rounded-xl bg-card anime-border group-hover:box-glow-cyan transition-all relative overflow-hidden"
                    >
                      {/* Animated gradient overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />

                      <div className="flex justify-between items-start flex-wrap gap-2 relative z-10">
                        <div>
                          <motion.h4
                            className="font-display text-sm font-bold text-foreground"
                            whileHover={{ scale: 1.05, x: 5 }}
                          >
                            {exp.role}
                          </motion.h4>
                          <motion.p
                            className="font-body text-secondary text-sm"
                            whileHover={{ scale: 1.03, x: 3 }}
                          >
                            {exp.company}
                          </motion.p>
                        </div>
                        <motion.span
                          className="font-body text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 255, 0.1)" }}
                        >
                          {exp.period}
                        </motion.span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground mt-2 relative z-10">{exp.desc}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <motion.h3 initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.8 }} className="font-display text-xl font-bold text-secondary text-glow-magenta mb-8 flex items-center gap-3">
                <GraduationCap size={20} /> Education <span className="jp-text text-sm text-secondary/30 font-normal">教育</span>
              </motion.h3>
              <div className="grid md:grid-cols-2 gap-6">
                {cvData.education.map((edu, i) => (
                  <motion.div
                    key={edu.degree}
                    initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -20 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
                    transition={{ delay: 1 + i * 0.15, type: "spring", stiffness: 120 }}
                    whileHover={{
                      y: -10,
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 15px 35px -10px rgba(255, 0, 255, 0.4)"
                    }}
                    className="p-5 rounded-xl bg-card anime-border hover:box-glow-magenta transition-all relative overflow-hidden group"
                  >
                    {/* Pulsing corner accent */}
                    <motion.div
                      className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />

                    <motion.h4
                      className="font-display text-sm font-bold text-foreground relative z-10"
                      whileHover={{ scale: 1.05, x: 3 }}
                    >
                      {edu.degree}
                    </motion.h4>
                    <motion.p
                      className="font-body text-secondary text-sm relative z-10"
                      whileHover={{ scale: 1.02 }}
                    >
                      {edu.school}
                    </motion.p>
                    <motion.span
                      className="font-body text-xs text-muted-foreground relative z-10 inline-block mt-1"
                      whileHover={{ scale: 1.1, color: "rgba(255, 0, 255, 0.8)" }}
                    >
                      {edu.year}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-8 md:p-12 anime-border max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Text Bio */}
              <div className="flex-1">
                <div className="border-b border-border pb-6 mb-6">
                  <h3 className="font-display text-2xl font-bold text-foreground">VICKY</h3>
                  <p className="font-body text-primary mt-1">Full Stack Developer</p>
                  <p className="jp-text text-xs text-primary/30 mt-0.5">フルスタック開発者</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                    </span>
                    <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest">LIVE_READY</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-4">vicky@email.com • +1 (555) 123-4567 • City, Country</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2 mb-3 flex items-center gap-2"><Briefcase size={14} /> Experience</h4>
                    {cvData.experience.map((exp) => (<div key={exp.role} className="mb-4 text-left"><div className="flex justify-between items-baseline gap-2"><strong className="font-body text-foreground text-sm">{exp.role}</strong><span className="font-body text-[10px] text-muted-foreground whitespace-nowrap">{exp.period}</span></div><p className="font-body text-secondary text-sm">{exp.company}</p></div>))}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-2 mb-3 flex items-center gap-2"><Code size={14} /> Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "TypeScript", "Node.js", "Python", "MongoDB", "AWS"].map((s) => (<span key={s} className="px-2 py-1 bg-muted rounded font-body text-[10px] text-muted-foreground">{s}</span>))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Preview Thumbnail */}
              {cvFile && (
                <div className="lg:w-1/3 w-full flex flex-col gap-4">
                  <p className="font-display text-[10px] text-primary/60 tracking-widest uppercase text-center mb-1">Uploaded Document</p>
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: -10 }}
                    onClick={() => setShowCvModal(true)}
                    className="relative cursor-pointer group rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/30 aspect-[1/1.4] w-full max-w-[200px] mx-auto flex items-center justify-center p-2 hover:border-primary/50 transition-all shadow-xl"
                  >
                    {cvFile.startsWith('data:image/') ? (
                      <img src={cvFile} alt="CV Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FileText size={40} className="text-primary/40 mx-auto mb-2" />
                        <p className="font-display text-[8px] text-primary/60">PDF CV</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-display text-[8px] tracking-widest font-bold">
                        VIEW
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              className="hidden"
              onChange={handleCvUpload}
            />
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 25px hsl(185, 100%, 50%, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (cvFile) {
                    setShowCvModal(true);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className={`flex-1 py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider rounded-lg box-glow-cyan flex items-center justify-center gap-2`}
              >
                {cvFile ? <><Eye size={16} /> VIEW PRESENTATION</> : <><Download size={16} /> UPLOAD CV</>}
              </motion.button>

              {cvFile && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = cvFile;
                      link.download = "vicky-cv";
                      link.click();
                    }}
                    className="px-6 py-3 bg-secondary text-secondary-foreground font-display text-sm tracking-wider rounded-lg box-glow-magenta flex items-center gap-2"
                  >
                    <Download size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removeCv}
                    className="px-4 py-3 bg-card border border-destructive/20 text-destructive rounded-lg transition-colors flex items-center justify-center"
                    title="Remove CV"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {/* CV Presentation Modal */}
        <AnimatePresence>
          {showCvModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-2xl p-4 md:p-10"
              onClick={() => setShowCvModal(false)}
            >
              {/* Anime character presenting the CV */}
              <motion.div
                initial={{ x: -200, opacity: 0, scale: 0.8 }}
                animate={{ x: 20, opacity: 1, scale: 1.1 }}
                exit={{ x: -100, opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="absolute left-0 bottom-0 w-80 h-80 z-20 hidden lg:block pointer-events-none"
              >
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <img
                    src={animeCharacter}
                    alt="Anime presenting CV"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(185,100,50,0.5)]"
                  />
                  {/* Character's hand appearing to hold the document edge */}
                  <motion.div
                    initial={{ rotate: -15, x: -50, opacity: 0 }}
                    animate={{
                      x: [-20, -15, -20],
                      rotate: [-15, -12, -15],
                      opacity: 1,
                      y: [0, 2, 0] // Synchronized with breathing
                    }}
                    transition={{
                      x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 0.5, delay: 0.4 }
                    }}
                    className="absolute top-[45%] right-[-15px] w-20 h-10 z-30 pointer-events-none"
                  >
                    <div className="relative w-full h-full">
                      {/* Detailed Hand Sprite Effect */}
                      <div className="absolute right-0 top-0 w-16 h-8 bg-[#f7d7c4] rounded-full border-2 border-primary/40 shadow-xl flex items-center justify-start pl-2">
                        <div className="w-5 h-6 bg-[#f7d7c4] rounded-full border-r border-black/10 -ml-1" /> {/* Thumb holding the edge */}
                      </div>
                      <div className="absolute right-4 top-2 w-4 h-5 bg-white/20 rounded-full blur-[1px]" />
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-card rounded-xl anime-border whitespace-nowrap box-glow-cyan"
                >
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="font-display text-xs text-primary"
                  >
                    「どうぞ、私の履歴書です！」
                  </motion.span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.2, rotateY: 90, opacity: 0 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                exit={{ scale: 0.2, rotateY: -90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="relative max-w-6xl w-full max-h-[95vh] overflow-y-auto rounded-3xl bg-white shadow-[0_0_100px_rgba(0,0,0,0.6)] p-1 border-8 border-card"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowCvModal(false)}
                  className="absolute top-6 right-6 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 z-50 shadow-xl"
                >
                  <X size={24} />
                </button>

                <div className="bg-[#f0f0f0] w-full min-h-[600px] shadow-inner p-1 md:p-4 text-black font-serif relative">
                  {cvFile ? (
                    cvFile.startsWith('data:image/') ? (
                      <div className="w-full flex justify-center bg-gray-100 p-4 rounded-xl">
                        <img src={cvFile} alt="Full CV Image" className="w-full max-w-3xl h-auto shadow-2xl" />
                      </div>
                    ) : (
                      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
                        <iframe
                          src={cvFile}
                          className="w-full h-full border-none rounded-xl shadow-2xl bg-white"
                          title="CV PDF Viewer"
                        />
                        <div className="mt-4 flex gap-4">
                          <a href={cvFile} download="vicky-cv" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity">
                            DOWNLOAD AS PDF
                          </a>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <FileText size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-400">No content available.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CVSection;

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Award, X, Upload, Image, Trash2, ExternalLink, Download } from "lucide-react";
import animeCharacter from "@/assets/anime-char-1.png";
import { useToast } from "@/hooks/use-toast";

interface UploadedCert {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  color: "primary" | "secondary" | "accent";
}

const defaultCertificates = [];

const colorCycle: ("primary" | "secondary" | "accent")[] = ["primary", "secondary", "accent"];

const CertificatesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [uploadedCerts, setUploadedCerts] = useState<UploadedCert[]>(() => {
    try {
      const saved = localStorage.getItem("uploaded_certificates");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load certificates:", e);
      return [];
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadIssuer, setUploadIssuer] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [engineStatus, setEngineStatus] = useState("OPTIMIZING");

  useEffect(() => {
    const statuses = ["SYNCING", "VERIFYING", "STABLE", "INDEXING", "ENCRYPTING"];
    const interval = setInterval(() => {
      setEngineStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Save certificates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("uploaded_certificates", JSON.stringify(uploadedCerts));
  }, [uploadedCerts]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload an image or PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload a file under 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview(e.target?.result as string);
      setShowUploadForm(true);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUploadSubmit = () => {
    if (!uploadPreview || !uploadTitle.trim()) {
      toast({ title: "Missing info", description: "Please provide a title for the certificate." });
      return;
    }
    const newCert: UploadedCert = {
      id: Date.now().toString(),
      title: uploadTitle.trim(),
      issuer: uploadIssuer.trim() || "Self-uploaded",
      date: new Date().getFullYear().toString(),
      imageUrl: uploadPreview,
      color: colorCycle[uploadedCerts.length % 3],
    };
    setUploadedCerts(prev => [...prev, newCert]);
    setShowUploadForm(false);
    setUploadTitle("");
    setUploadIssuer("");
    setUploadPreview(null);
    toast({ title: "🏆 Certificate uploaded!", description: `"${newCert.title}" has been added to your collection.` });
  };

  const removeUploadedCert = (id: string) => {
    setUploadedCerts(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem("uploaded_certificates", JSON.stringify(updated));
      return updated;
    });
    toast({ title: "Certificate removed" });
  };

  const allCerts = [
    ...uploadedCerts.map((c, i) => ({
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      color: c.color,
      link: c.imageUrl,
      description: `Uploaded certificate: ${c.title}`,
      isUploaded: true,
      uploadId: c.id,
      index: i,
    })),
    ...defaultCertificates.map((c, i) => ({
      ...c,
      isUploaded: false,
      uploadId: "",
      index: uploadedCerts.length + i
    })),
  ];

  return (
    <section id="certificates" className="py-32 relative" ref={ref}>
      {/* Japanese watermark */}
      <motion.span
        className="jp-watermark text-[10rem] top-10 left-10"
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        証明書
      </motion.span>
      <motion.span
        className="jp-watermark text-[6rem] bottom-20 right-10"
        animate={{ opacity: [0.03, 0.05, 0.03], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        達成
      </motion.span>

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
            Achievements · <span className="jp-text">実績</span>
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text">
            Certificates
          </h2>
          <motion.p
            className="jp-text text-muted-foreground/40 text-sm mt-2"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            証明書コレクション
          </motion.p>

          {/* Live Engine Indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 px-6 py-2 bg-black/40 backdrop-blur-xl border border-primary/20 rounded-xl">
              <div className="flex flex-col items-start">
                <span className="text-[8px] uppercase tracking-[0.2em] text-primary/60 font-display">Verification Engine</span>
                <span className="font-mono text-xs text-primary tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full animate-ping" />
                  {engineStatus}_
                </span>
              </div>
              <div className="w-[1px] h-8 bg-primary/10 mx-2" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[8px] uppercase tracking-[0.2em] text-secondary/60 font-display">System Load</span>
                <span className="font-mono text-xs text-secondary tracking-widest">{Math.floor(Math.random() * 20 + 5)}%</span>
              </div>
            </div>
          </div>

          <div className="w-20 h-0.5 bg-primary mx-auto mt-8" />
          {uploadedCerts.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-body text-[10px] text-primary uppercase tracking-widest">{uploadedCerts.length} Uploaded</span>
            </motion.div>
          )}
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mb-12"
        >
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01, borderColor: "hsl(185, 100%, 50%)" }}
            whileTap={{ scale: 0.99 }}
            className={`relative cursor-pointer p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging
              ? "border-primary bg-primary/10 box-glow-cyan"
              : "border-muted-foreground/20 bg-card/50 hover:border-primary/50"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
                e.target.value = "";
              }}
            />
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={isDragging ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : { y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-4 rounded-full bg-muted text-primary"
              >
                <Upload size={28} />
              </motion.div>
              <div className="text-center">
                <p className="font-display text-sm text-foreground">
                  {isDragging ? "Drop your certificate here!" : "Upload Your Certificates"}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Drag & drop or click to browse • Images & PDF • Max 5MB
                </p>
                <p className="jp-text text-xs text-primary/40 mt-1">証明書をアップロード</p>
              </div>
            </div>

            {/* Animated corner decorations */}
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-secondary/40 rounded-tr-xl" />
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/40 rounded-bl-xl" />
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />
          </motion.div>
        </motion.div>

        {/* Upload Form Modal */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg p-6"
              onClick={() => setShowUploadForm(false)}
            >
              <motion.div
                initial={{ scale: 0.5, rotateX: 20, opacity: 0 }}
                animate={{ scale: 1, rotateX: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotateX: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative max-w-md w-full p-8 rounded-2xl bg-card anime-border box-glow-cyan"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setShowUploadForm(false)} className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80">
                  <X size={16} className="text-foreground" />
                </button>
                <h3 className="font-display text-lg font-bold text-primary text-glow-cyan mb-6 text-center">
                  🏆 Add Certificate Details
                </h3>
                {uploadPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-xl overflow-hidden border border-primary/20"
                  >
                    <img src={uploadPreview} alt="Preview" className="w-full h-40 object-cover" />
                  </motion.div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">Certificate Title *</label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. AWS Solutions Architect"
                      className="w-full px-4 py-2 bg-muted rounded-lg font-body text-foreground placeholder:text-muted-foreground/50 border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm text-muted-foreground block mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={uploadIssuer}
                      onChange={(e) => setUploadIssuer(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-4 py-2 bg-muted rounded-lg font-body text-foreground placeholder:text-muted-foreground/50 border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 25px hsl(185, 100%, 50%, 0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUploadSubmit}
                    className="w-full py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider rounded-lg box-glow-cyan flex items-center justify-center gap-2"
                  >
                    <Upload size={16} /> ADD CERTIFICATE
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {allCerts.map((cert, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={`${cert.title}-${i}`}
                initial={{ opacity: 0, rotateY: -30, scale: 0.8 }}
                animate={isInView ? { opacity: 1, rotateY: 0, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.6, type: "spring", stiffness: 150 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setSelectedCert(i);
                }}
                className="relative group cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  animate={
                    isHovered
                      ? { rotateX: -8, rotateY: 5, y: -20, z: 50, scale: 1.05 }
                      : { rotateX: 0, rotateY: 0, y: 0, z: 0, scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative p-6 rounded-2xl bg-card overflow-hidden ${isHovered
                    ? cert.color === "primary" ? "box-glow-cyan" : cert.color === "secondary" ? "box-glow-magenta" : "box-glow-purple"
                    : ""
                    }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 anime-border rounded-2xl pointer-events-none" />

                  {/* Scanline on hover */}
                  {isHovered && (
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute left-0 right-0 h-0.5 bg-primary/30 pointer-events-none"
                    />
                  )}

                  {/* Card front visuals */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Live Verification Badge */}
                    <div className="absolute top-0 right-0 flex items-center gap-1.5 px-2 py-0.5 bg-neon-green/10 rounded-full border border-neon-green/20">
                      <span className="w-1 h-1 bg-neon-green rounded-full animate-pulse" />
                      <span className="text-[8px] font-mono text-neon-green tracking-tighter">VERIFIED_LIVE</span>
                    </div>

                    <div className="mb-6 relative">
                      <motion.div
                        animate={isHovered ? {
                          rotate: [0, -5, 5, 0],
                          scale: [1, 1.1, 1],
                          boxShadow: "0 0 30px rgba(0, 255, 255, 0.4)"
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`p-6 rounded-full bg-muted border-2 ${cert.color === "primary" ? "border-primary/40 text-primary box-glow-cyan" :
                          cert.color === "secondary" ? "border-secondary/40 text-secondary box-glow-magenta" :
                            "border-accent/40 text-accent box-glow-purple"
                          }`}
                      >
                        <Award size={40} className="drop-shadow-lg" />
                      </motion.div>

                      {cert.isUploaded && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 bg-background rounded-full p-1.5 border border-primary/30 shadow-xl"
                        >
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-white"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="w-full text-center">
                      <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-1">
                        {cert.title}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">
                        {cert.issuer}
                      </p>

                      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="font-body text-[10px] text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                          {cert.date}
                        </span>
                        <div className="flex gap-2">
                          {cert.isUploaded && (
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); removeUploadedCert(cert.uploadId); }}
                              className="p-1 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            >
                              <Trash2 size={12} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corners */}
                  <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl ${cert.color === "primary" ? "border-primary/30" : cert.color === "secondary" ? "border-secondary/30" : "border-accent/30"
                    }`} />
                  <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl ${cert.color === "primary" ? "border-primary/30" : cert.color === "secondary" ? "border-secondary/30" : "border-accent/30"
                    }`} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Certificate Detail Popup */}
        <AnimatePresence>
          {selectedCert !== null && selectedCert < allCerts.length && (
            <motion.div
              key="cert-detail-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.3, rotateX: 30, opacity: 0 }}
                animate={{ scale: 1, rotateX: 0, opacity: 1 }}
                exit={{ scale: 0.3, rotateX: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
                style={{ perspective: "1000px" }}
              >
                {/* Anime character presenting the certificate */}
                <motion.div
                  initial={{ x: 200, opacity: 0, scale: 0.8 }}
                  animate={{ x: 120, opacity: 1, scale: 1 }}
                  exit={{ x: 200, opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className="absolute -right-32 bottom-0 w-80 h-80 z-20 hidden lg:block pointer-events-none"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [2, -2, 2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <img
                      src={animeCharacter}
                      alt="Anime presenting certificate"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,0,255,0.6)] scale-x-[-1]"
                    />
                    {/* Character's hand appearing to hold the card edge */}
                    <motion.div
                      initial={{ rotate: 15, x: 50, opacity: 0 }}
                      animate={{
                        x: [25, 20, 25],
                        rotate: [15, 12, 15],
                        opacity: 1,
                        y: [0, -2, 0] // Synchronized breathing
                      }}
                      transition={{
                        x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.5, delay: 0.4 }
                      }}
                      className="absolute top-[45%] left-[-20px] w-20 h-10 z-30 pointer-events-none"
                    >
                      <div className="relative w-full h-full">
                        <div className="absolute left-0 top-0 w-16 h-8 bg-[#f7d7c4] rounded-full border-2 border-secondary/40 shadow-xl flex items-center justify-end pr-2">
                          <div className="w-5 h-6 bg-[#f7d7c4] rounded-full border-l border-black/10 -mr-1" /> {/* Thumb holding the edge */}
                        </div>
                        <div className="absolute left-4 top-2 w-4 h-5 bg-white/20 rounded-full blur-[1px]" />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  animate={{ rotateX: [-2, 2, -2], rotateY: [-1, 1, -1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`p-1 rounded-3xl bg-card overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ${allCerts[selectedCert].color === "primary" ? "box-glow-cyan" : allCerts[selectedCert].color === "secondary" ? "box-glow-magenta" : "box-glow-purple"
                    }`}
                >
                  <div className="p-8 md:p-12 anime-border rounded-3xl bg-card relative z-10">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedCert(null); }} className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 z-30 shadow-lg">
                      <X size={20} className="text-foreground" />
                    </button>

                    <div className="text-center mb-6">
                      {allCerts[selectedCert].link && allCerts[selectedCert].link.startsWith('data:') ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7, rotateX: 30, y: 50 }}
                          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                          className="mb-6 rounded-xl overflow-hidden border-4 border-white shadow-2xl bg-white w-full max-w-[800px] h-[600px] mx-auto relative group flex items-center justify-center"
                        >
                          {allCerts[selectedCert].link.includes('application/pdf') ? (
                            <iframe
                              src={allCerts[selectedCert].link}
                              className="w-full h-full border-none"
                              title="Certificate PDF Viewer"
                            />
                          ) : (
                            <img
                              src={allCerts[selectedCert].link}
                              alt="Certificate Content"
                              className="w-full h-full object-contain cursor-zoom-in"
                              onClick={() => window.open(allCerts[selectedCert].link, '_blank')}
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <p className="text-white font-display text-[8px] tracking-widest">CONTENT PREVIEW</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`inline-block p-4 rounded-2xl bg-muted mb-4 ${allCerts[selectedCert].color === "primary" ? "text-primary" : allCerts[selectedCert].color === "secondary" ? "text-secondary" : "text-accent"
                            }`}
                        >
                          <Award size={40} />
                        </motion.div>
                      )}
                      <h3 className={`font-display text-2xl font-bold mb-2 ${allCerts[selectedCert].color === "primary" ? "text-primary text-glow-cyan" : allCerts[selectedCert].color === "secondary" ? "text-secondary text-glow-magenta" : "text-accent text-glow-purple"
                        }`}>
                        {allCerts[selectedCert].title}
                      </h3>
                      <p className="font-body text-muted-foreground">
                        Issued by <span className="text-foreground font-semibold">{allCerts[selectedCert].issuer}</span> • {allCerts[selectedCert].date}
                      </p>
                    </div>

                    <p className="font-body text-muted-foreground leading-relaxed text-center mb-8 px-4">
                      {allCerts[selectedCert].description}
                    </p>

                    {allCerts[selectedCert].link && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          const link = allCerts[selectedCert].link;
                          if (link.startsWith('data:')) {
                            const a = document.createElement('a');
                            a.href = link;
                            a.download = `certificate-${allCerts[selectedCert].title.replace(/\s+/g, '-').toLowerCase()}`;
                            a.click();
                          } else {
                            window.open(link, '_blank');
                          }
                        }}
                        className="w-full py-4 bg-primary text-primary-foreground font-display text-xs tracking-widest rounded-xl box-glow-cyan flex items-center justify-center gap-3 font-bold"
                      >
                        {allCerts[selectedCert].link.startsWith('data:') ? (
                          <><Download size={18} /> DOWNLOAD CERTIFICATE</>
                        ) : (
                          <><ExternalLink size={18} /> VIEW ON ISSUER SITE</>
                        )}
                      </motion.button>
                    )}

                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-2xl border-primary/40" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 rounded-tr-2xl border-secondary/40" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-2xl border-accent/40" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-2xl border-primary/40" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CertificatesSection;

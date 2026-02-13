import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", jp: "紹介", href: "#about" },
  { label: "Projects", jp: "作品", href: "#projects" },
  { label: "Internships", jp: "経験", href: "#experience" },
  { label: "Certificates", jp: "証", href: "#certificates" },
  { label: "CV", jp: "履歴", href: "#cv" },
  { label: "Contact", jp: "連絡", href: "#contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-card/80 backdrop-blur-xl rounded-2xl px-6 py-3 anime-border">
        <div className="flex items-center gap-6">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="font-display text-xl font-bold gradient-text tracking-wider flex items-center gap-2"
          >
            BHARGAW
            <motion.span
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="jp-text text-xs text-primary/40 font-normal"
            >
              ポートフォリオ
            </motion.span>
          </motion.a>

          {/* Live Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            <span className="text-[10px] font-display uppercase tracking-widest text-neon-green/80">
              System Live
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -2, color: "hsl(185, 100%, 50%)" }}
              className="relative px-3 py-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              {item.label}
              <motion.span
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300"
              />
              <motion.span
                className="absolute -top-3 left-1/2 -translate-x-1/2 jp-text text-[8px] text-primary/0 group-hover:text-primary/40 transition-all duration-300"
              >
                {item.jp}
              </motion.span>
            </motion.a>
          ))}
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-2 bg-card/95 backdrop-blur-xl rounded-2xl p-4 anime-border"
        >
          {navItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between py-3 px-4 font-body text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            >
              <span>{item.label}</span>
              <span className="jp-text text-xs text-primary/30">{item.jp}</span>
            </motion.a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navigation;

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Code, Mail, MapPin, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 👉 PASTE YOUR KEYS HERE:
    const SERVICE_ID = 'service_ve1eh2i'.trim();
    const TEMPLATE_ID = 'template_84ij83x'.trim();
    const PUBLIC_KEY = 'DUDCOB5sH3kcMj4oq'.trim();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    setIsSending(true);

    // This check warns you if you haven't replaced the placeholders above
    if ([SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY].some(key => key.includes('YOUR_'))) {
      toast({
        title: "⚠️ Keys Required",
        description: "Please replace the 'YOUR_...' placeholders with your actual keys from EmailJS.",
        variant: "destructive",
        duration: 10000
      });
      setIsSending(false);
      return;
    }

    try {
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Bhargaw',
        },
        PUBLIC_KEY
      );

      if (result.status === 200) {
        setSent(true);
        toast({ title: "🎉 Message sent!", description: "Thanks for reaching out! I'll get back to you soon." });
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 5000);
      }
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      toast({
        title: "Submission failed",
        description: error?.text || error?.message || "There was an error sending your message. Please verify your keys in ContactSection.tsx.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const socialLinks = [
    { icon: Github, label: "GitHub", jp: "ギットハブ", href: "https://github.com/bhargawpradhan", color: "primary" },
    { icon: Linkedin, label: "LinkedIn", jp: "リンクドイン", href: "https://www.linkedin.com/in/bhargaw020/", color: "secondary" },
    { icon: Code, label: "Leetcode", jp: "ツイッター", href: "https://leetcode.com/u/bhargawpradhan/", color: "accent" },
    { icon: Mail, label: "Email", jp: "メール", href: "mailto:bhargawpradhan@gmail.com", color: "primary" },
  ];

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      <motion.span className="jp-watermark text-[12rem] top-5 left-5" animate={{ opacity: [0.02, 0.05, 0.02] }} transition={{ duration: 8, repeat: Infinity }}>連絡先</motion.span>
      <motion.span className="jp-watermark text-[6rem] bottom-10 right-10" animate={{ opacity: [0.02, 0.04, 0.02] }} transition={{ duration: 6, repeat: Infinity }}>手紙</motion.span>

      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={`contact-p-${i}`} className="absolute w-1 h-1 rounded-full bg-primary/30" style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 30}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="font-body text-secondary tracking-[0.3em] uppercase text-sm">
            Contact · <span className="jp-text">連絡先</span>
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text">Get In Touch</h2>
          <motion.p className="jp-text text-muted-foreground/40 text-sm mt-2" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>お気軽にご連絡ください</motion.p>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2, type: "spring" }} onSubmit={handleSubmit} className="space-y-5">
            <motion.div whileHover={{ y: -2 }}>
              <label className="font-body text-sm text-muted-foreground block mb-1.5">Name <span className="jp-text text-primary/30 text-xs">名前</span></label>
              <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Your name"
                className="w-full px-4 py-3 bg-card rounded-xl font-body text-foreground placeholder:text-muted-foreground/40 border border-border focus:border-primary focus:outline-none anime-border transition-all focus:box-glow-cyan" />
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <label className="font-body text-sm text-muted-foreground block mb-1.5">Email <span className="jp-text text-primary/30 text-xs">メール</span></label>
              <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com"
                className="w-full px-4 py-3 bg-card rounded-xl font-body text-foreground placeholder:text-muted-foreground/40 border border-border focus:border-primary focus:outline-none anime-border transition-all focus:box-glow-cyan" />
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <label className="font-body text-sm text-muted-foreground block mb-1.5">Message <span className="jp-text text-primary/30 text-xs">メッセージ</span></label>
              <textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} placeholder="Your message..." rows={5}
                className="w-full px-4 py-3 bg-card rounded-xl font-body text-foreground placeholder:text-muted-foreground/40 border border-border focus:border-primary focus:outline-none anime-border transition-all focus:box-glow-cyan resize-none" />
            </motion.div>
            <motion.button type="submit" disabled={isSending} whileHover={{ scale: 1.03, boxShadow: "0 0 25px hsl(185, 100%, 50%, 0.5)" }} whileTap={{ scale: 0.97 }}
              className="w-full py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider rounded-xl box-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50">
              {sent ? <><CheckCircle size={16} /> SENT!</> : isSending ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> SENDING...</> : <><Send size={16} /> SEND MESSAGE</>}
            </motion.button>
          </motion.form>

          {/* Contact Info & Socials */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3, type: "spring" }} className="space-y-8">
            <div className="p-6 rounded-2xl bg-card anime-border">
              <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                Let's Connect <span className="jp-text text-sm text-primary/30 font-normal">繋がろう</span>
              </h3>
              <p className="font-body text-muted-foreground mb-6">I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground"><MapPin size={16} className="text-primary" /><span className="font-body text-sm">Balasore, Odisha | Jamshedpur, Jharkhand</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><Phone size={16} className="text-secondary" /><span className="font-body text-sm">+91 74885 51754</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><Mail size={16} className="text-accent" /><span className="font-body text-sm">bhargawpradhan@gmail.com</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link, i) => (
                <motion.a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-card anime-border transition-all hover:${link.color === "primary" ? "box-glow-cyan" : link.color === "secondary" ? "box-glow-magenta" : "box-glow-purple"}`}>
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <link.icon size={24} className={link.color === "primary" ? "text-primary" : link.color === "secondary" ? "text-secondary" : "text-accent"} />
                  </motion.div>
                  <span className="font-display text-xs tracking-wider">{link.label}</span>
                  <span className="jp-text text-[10px] text-muted-foreground/40">{link.jp}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

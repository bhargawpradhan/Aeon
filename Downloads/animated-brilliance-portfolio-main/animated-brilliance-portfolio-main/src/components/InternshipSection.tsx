import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Building2, Calendar, MapPin, ArrowRight, X } from "lucide-react";

const internships = [
  {
    role: "Software Developer Intern",
    company: "Deloitte",
    period: "Jul 2025 - Sep 2025",
    location: "Remote",
    description: "Worked on Google Maps UI components, improving accessibility and performance. Implemented new React-based features used by millions.",
    detailedDescription: `During my internship at Deloitte, I had the opportunity to work on cutting-edge software development projects that impacted millions of users globally. My role involved developing and optimizing enterprise-level applications with a focus on performance, scalability, and user experience.

Key Responsibilities:
• Developed and maintained complex web applications using modern JavaScript frameworks
• Collaborated with cross-functional teams including designers, product managers, and senior developers
• Implemented responsive UI components following accessibility standards (WCAG 2.1)
• Optimized application performance, reducing load times by 40%
• Participated in code reviews and contributed to best practices documentation

Technical Achievements:
• Built reusable component library used across multiple projects
• Implemented automated testing suite increasing code coverage to 85%
• Integrated RESTful APIs and handled complex data transformations
• Worked with MySQL databases, optimizing queries for better performance
• Utilized Git for version control and collaborated using Agile methodologies`,
    achievements: [
      "Improved application performance by 40%",
      "Developed reusable component library",
      "Achieved 85% code coverage with automated tests",
      "Collaborated with international teams across 3 time zones"
    ],
    tech: ["C", "C++", "Java", "Python", "HTML", "CSS", "JavaScript", "PHP", "MySQL", "Git", "DSA"],
    color: "primary",
    jp: "フロントエンド開発",
  },
  {
    role: "Gen AI Intern",
    company: "Tata",
    period: "Jun 2025 - May 2025",
    location: "Remote",
    description: "Worked as a Generative AI Intern focusing on LLM-based applications, prompt engineering, and AI model integration using Python and APIs.",
    detailedDescription: `As a Generative AI Intern at Tata, I worked at the forefront of artificial intelligence technology, developing innovative solutions using Large Language Models and cutting-edge AI frameworks. This role allowed me to explore the practical applications of AI in real-world business scenarios.

Key Responsibilities:
• Designed and implemented LLM-based applications for business automation
• Conducted extensive prompt engineering to optimize AI model outputs
• Integrated various AI APIs including OpenAI, Hugging Face, and custom models
• Developed natural language processing pipelines for text analysis
• Created documentation and training materials for AI implementation

Technical Achievements:
• Built an intelligent chatbot system handling 1000+ daily queries
• Implemented RAG (Retrieval-Augmented Generation) architecture for enhanced accuracy
• Fine-tuned pre-trained models for domain-specific tasks
• Developed automated content generation tools reducing manual work by 60%
• Experimented with various LLMs including GPT-4, Claude, and open-source alternatives

Innovation & Impact:
• Pioneered AI-driven solutions that improved operational efficiency
• Contributed to research on prompt optimization techniques
• Collaborated with data science team on model evaluation metrics`,
    achievements: [
      "Developed AI chatbot handling 1000+ daily queries",
      "Reduced manual content work by 60% through automation",
      "Implemented RAG architecture for improved accuracy",
      "Fine-tuned multiple LLMs for specialized tasks"
    ],
    tech: ["Python", "Generative AI", "LLMs", "Prompt Engineering", "NLP", "OpenAI API", "Hugging Face", "Git"],
    color: "secondary",
    jp: "フルスタック開発",
  },
  {
    role: "Web Development Intern",
    company: "Yardstik",
    period: "Mar 2025 - Apr 2025",
    location: "On-site",
    description: "Built the company's main product from scratch, including responsive design, authentication, and payment integration.",
    detailedDescription: `At Yardstik, I was entrusted with building the company's flagship product from the ground up. This intensive internship provided hands-on experience in full-stack development, from initial design to production deployment. Working on-site allowed for close collaboration with the founding team and rapid iteration.

Key Responsibilities:
• Architected and developed the complete web application using Next.js
• Implemented secure authentication system with JWT and OAuth
• Integrated Stripe payment gateway for subscription management
• Designed and built responsive UI components with Tailwind CSS
• Set up PostgreSQL database with optimized schema design
• Deployed application to production with CI/CD pipeline

Technical Achievements:
• Built fully responsive application working seamlessly across all devices
• Implemented secure payment processing handling real transactions
• Created admin dashboard for business analytics and user management
• Optimized SEO achieving 95+ Lighthouse scores
• Integrated email notifications and real-time updates
• Implemented comprehensive error handling and logging

Product Impact:
• Successfully launched MVP within 2-month timeline
• Onboarded first 100+ users with positive feedback
• Achieved 99.9% uptime in production environment
• Reduced page load times to under 2 seconds`,
    achievements: [
      "Built complete product from scratch in 2 months",
      "Achieved 95+ Lighthouse performance score",
      "Successfully onboarded 100+ users",
      "Implemented secure payment processing with Stripe"
    ],
    tech: ["Next.js", "Tailwind", "Stripe", "Node.js", "PostgreSQL"],
    color: "accent",
    jp: "ウェブ開発",
  },
];

const InternshipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedInternship, setSelectedInternship] = useState<typeof internships[0] | null>(null);

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {selectedInternship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedInternship(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card rounded-3xl p-8 anime-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedInternship(null)}
                className={`absolute top-6 right-6 p-2 rounded-full bg-muted ${selectedInternship.color === "primary"
                  ? "text-primary hover:box-glow-cyan"
                  : selectedInternship.color === "secondary"
                    ? "text-secondary hover:box-glow-magenta"
                    : "text-accent hover:box-glow-purple"
                  } transition-all`}
              >
                <X size={24} />
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`p-3 rounded-xl bg-muted ${selectedInternship.color === "primary"
                      ? "text-primary box-glow-cyan"
                      : selectedInternship.color === "secondary"
                        ? "text-secondary box-glow-magenta"
                        : "text-accent box-glow-purple"
                      }`}
                  >
                    <Building2 size={32} />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`font-display text-3xl font-bold mb-2 ${selectedInternship.color === "primary"
                        ? "text-primary"
                        : selectedInternship.color === "secondary"
                          ? "text-secondary"
                          : "text-accent"
                        }`}
                    >
                      {selectedInternship.role}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="font-body text-xl font-semibold text-foreground mb-2"
                    >
                      {selectedInternship.company}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap gap-4 text-muted-foreground"
                    >
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span className="font-body text-sm">{selectedInternship.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="font-body text-sm">{selectedInternship.location}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="jp-text text-sm text-primary/40"
                >
                  {selectedInternship.jp}
                </motion.span>
              </motion.div>

              {/* Detailed Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                <h3 className="font-display text-xl font-bold mb-3 gradient-text">
                  Experience Overview
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selectedInternship.detailedDescription}
                </p>
              </motion.div>

              {/* Key Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <h3 className="font-display text-xl font-bold mb-3 gradient-text">
                  Key Achievements
                </h3>
                <div className="grid gap-3">
                  {selectedInternship.achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className={`w-2 h-2 rounded-full mt-2 ${selectedInternship.color === "primary"
                          ? "bg-primary box-glow-cyan"
                          : selectedInternship.color === "secondary"
                            ? "bg-secondary box-glow-magenta"
                            : "bg-accent box-glow-purple"
                          }`}
                      />
                      <p className="font-body text-sm text-foreground flex-1">{achievement}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <h3 className="font-display text-xl font-bold mb-3 gradient-text">
                  Technologies Used
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedInternship.tech.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + i * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`text-sm px-3 py-1.5 rounded-full font-body cursor-default ${selectedInternship.color === "primary"
                        ? "bg-primary/10 text-primary"
                        : selectedInternship.color === "secondary"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-accent/10 text-accent"
                        }`}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="internships" className="py-32 relative overflow-hidden" ref={ref}>
        {/* Japanese watermarks */}
        <motion.span
          className="jp-watermark text-[11rem] top-0 right-5"
          animate={{ opacity: [0.02, 0.05, 0.02], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          経験
        </motion.span>
        <motion.span
          className="jp-watermark text-[6rem] bottom-10 left-10"
          animate={{ opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          成長
        </motion.span>

        {/* Background decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 top-20 w-80 h-80 rounded-full border border-accent/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 bottom-20 w-60 h-60 rounded-full border border-primary/5"
        />

        {/* Floating anime particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`intern-particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent/20"
            style={{ left: `${15 + i * 15}%`, top: `${10 + (i % 3) * 30}%` }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="max-w-5xl mx-auto px-6">
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
              Experience · <span className="jp-text">経験</span>
            </motion.span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 gradient-text">
              Internships
            </h2>
            <motion.p
              className="jp-text text-muted-foreground/40 text-sm mt-2"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              インターンシップ経歴
            </motion.p>
            <div className="w-20 h-0.5 bg-primary mx-auto mt-6" />
          </motion.div>

          <div className="relative">
            {/* Animated vertical line */}
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : {}}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"
            />

            {internships.map((intern, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={intern.role}
                  initial={{ opacity: 0, x: isEven ? -60 : 60, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.25, type: "spring", stiffness: 100 }}
                  className={`relative flex items-center mb-12 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.25, type: "spring" }}
                    className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full z-10 ${intern.color === "primary" ? "bg-primary box-glow-cyan" : intern.color === "secondary" ? "bg-secondary box-glow-magenta" : "bg-accent box-glow-purple"
                      }`}
                  >
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full ${intern.color === "primary" ? "bg-primary" : intern.color === "secondary" ? "bg-secondary" : "bg-accent"
                        }`}
                    />
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    className={`ml-14 md:ml-0 md:w-[calc(50%-40px)] p-6 rounded-2xl bg-card anime-border hover:${intern.color === "primary" ? "box-glow-cyan" : intern.color === "secondary" ? "box-glow-magenta" : "box-glow-purple"
                      } transition-all group tilt-card`}
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="flex items-start justify-between mb-3">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.5 }}
                          className={`p-2 rounded-lg bg-muted ${intern.color === "primary" ? "text-primary" : intern.color === "secondary" ? "text-secondary" : "text-accent"
                            }`}
                        >
                          <Building2 size={20} />
                        </motion.div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin size={12} />
                            <span className="font-body text-xs">{intern.location}</span>
                          </div>
                          <span className="jp-text text-[10px] text-primary/30">{intern.jp}</span>
                        </div>
                      </div>

                      <h3 className={`font-display text-lg font-bold mb-1 ${intern.color === "primary" ? "text-primary" : intern.color === "secondary" ? "text-secondary" : "text-accent"
                        }`}>
                        {intern.role}
                      </h3>
                      <p className="font-body text-foreground font-semibold text-sm mb-1">{intern.company}</p>
                      <div className="flex items-center gap-1 text-muted-foreground mb-3">
                        <Calendar size={12} />
                        <span className="font-body text-xs">{intern.period}</span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                        {intern.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {intern.tech.map((t) => (
                          <motion.span
                            key={t}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="text-xs px-2 py-1 bg-muted rounded-full font-body text-muted-foreground cursor-default"
                          >
                            {t}
                          </motion.span>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                        className="mt-4 flex items-center gap-1 text-primary cursor-pointer"
                        onClick={() => setSelectedInternship(intern)}
                      >
                        <ArrowRight size={14} />
                        <span className="font-body text-xs tracking-wider uppercase">View Details</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default InternshipSection;

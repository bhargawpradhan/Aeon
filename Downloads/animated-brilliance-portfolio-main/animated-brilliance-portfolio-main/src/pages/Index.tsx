// import CustomCursor from "@/components/CustomCursor";
// import Navigation from "@/components/Navigation";
// import HeroSection from "@/components/HeroSection";
// import AboutSection from "@/components/AboutSection";
// import ProjectsSection from "@/components/ProjectsSection";
// import CertificatesSection from "@/components/CertificatesSection";
// import InternshipSection from "@/components/InternshipSection";
// import CVSection from "@/components/CVSection";
// import ContactSection from "@/components/ContactSection";

// const Index = () => {
//   return (
//     <div className="min-h-screen bg-background relative">
//       <CustomCursor />
//       <Navigation />
//       <HeroSection />
//       <AboutSection />
//       <ProjectsSection />
//       <CertificatesSection />
//       <InternshipSection />
//       <CVSection />
//       <ContactSection />
//     </div>
//   );
// };

// export default Index;

// src/pages/Index.tsx
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificatesSection from "@/components/CertificatesSection";
import InternshipSection from "@/components/InternshipSection";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimatedSection from "@/components/AnimatedSection";
import PopupAnimation from "@/components/PopupAnimation";
import AnimeParade from "@/components/AnimeParade";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative text-white overflow-x-hidden">
      <AnimeParade />
      <AnimatedBackground />
      <CustomCursor />
      <Navigation />

      <main>
        <HeroSection />

        <AnimatedSection id="about" delay={0.1}>
          <PopupAnimation delay={0.2}>
            <AboutSection />
          </PopupAnimation>
        </AnimatedSection>

        <AnimatedSection id="projects" className="bg-gray-900/30" delay={0.2}>
          <PopupAnimation delay={0.3} direction="left">
            <ProjectsSection />
          </PopupAnimation>
        </AnimatedSection>

        <AnimatedSection id="certificates" delay={0.3}>
          <PopupAnimation delay={0.4} direction="right">
            <CertificatesSection />
          </PopupAnimation>
        </AnimatedSection>

        <AnimatedSection id="experience" className="bg-gray-900/30" delay={0.4}>
          <PopupAnimation delay={0.5}>
            <InternshipSection />
          </PopupAnimation>
        </AnimatedSection>

        <AnimatedSection id="cv" delay={0.5}>
          <PopupAnimation delay={0.6} direction="left">
            <CVSection />
          </PopupAnimation>
        </AnimatedSection>

        <AnimatedSection id="contact" className="bg-gray-900/30" delay={0.6}>
          <PopupAnimation delay={0.7} direction="up">
            <ContactSection />
          </PopupAnimation>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default Index;
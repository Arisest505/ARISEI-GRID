import AboutSection from "../widgets/Home/AboutSection";
import HeroSection from "../widgets/Home/HeroSection";
import VersionSection from "../widgets/Home/VersionSection";
import FaqSection from "../widgets/Home/FaqSection";

export default function HomePage() {
  return (
    <>

      <main>
        <HeroSection />
        <AboutSection />
        <VersionSection />
        <FaqSection />
      </main>

    </>
  );
}

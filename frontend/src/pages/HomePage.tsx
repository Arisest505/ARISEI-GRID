import AboutSection from "../widgets/Home/AboutSection";
import HeroSection from "../widgets/Home/HeroSection";
import Footer from "../widgets/Footer";
import NavBar from "../widgets/NavBar";
import VersionSection from "../widgets/Home/VersionSection";
import FaqSection from "../widgets/Home/FaqSection";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <VersionSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}

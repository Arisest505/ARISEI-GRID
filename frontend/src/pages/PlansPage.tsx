import PlansHero from "../widgets/Plans/PlansHero";
import Footer from "../widgets/Footer";
import NavBar from "../widgets/NavBar";
import PlansAbout from "../widgets/Plans/PlansAbout";
import PlansFaq from "../widgets/Plans/PlansFaq";

export default function PlansPage() {
  return (
    <>
      <NavBar />
      <main>
        <PlansHero />
        <PlansAbout/>
        <PlansFaq />

      </main>
      <Footer />
    </>
  );
}

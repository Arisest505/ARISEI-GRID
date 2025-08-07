import PlansHero from "../widgets/Plans/PlansHero";
import PlansAbout from "../widgets/Plans/PlansAbout";
import PlansFaq from "../widgets/Plans/PlansFaq";
import PlansActivateForm from "../widgets/Plans/PlansActivateForm";

export default function PlansPage() {
  return (
    <>
      <main>
        <PlansHero />
        <PlansAbout />
        <PlansActivateForm />
        <PlansFaq />

      </main>
    </>
  );
}

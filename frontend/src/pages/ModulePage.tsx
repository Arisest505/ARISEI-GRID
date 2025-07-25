// src/pages/ModulePage.tsx
import AdministracionModules from "../widgets/Module/AdministracionModules";
import ModuleHeroSection from "../widgets/Module/ModuleHeroSection";

export default function ModulePage() {
  return (
    <main className="w-full min-h-screen text-black bg-gray-50">
      <section className="w-full px-6 py-10 mx-auto space-y-10 max-w-screen-2xl">
        <ModuleHeroSection />
        <AdministracionModules />
      </section>
    </main>
  );
}

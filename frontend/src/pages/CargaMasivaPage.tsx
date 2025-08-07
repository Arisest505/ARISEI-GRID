import CargaMasivaForm from "../widgets/CargaMasiva/CargaMasivaForm";
import CargaMasivaHeroSection from "../widgets/CargaMasiva/CargaMasivaHeroSection";
import EjemploCargaMasivaSection from "../widgets/CargaMasiva/EjemploCargaMasivaSection";

export default function CargaMasivaPage() {
  return (
    <>
      <CargaMasivaHeroSection />

      <main className="px-4 my-10 space-y-16">
        {/* Espacio entre secciones controlado con space-y */}
        <CargaMasivaForm />
        <EjemploCargaMasivaSection />
      </main>
    </>
  );
}

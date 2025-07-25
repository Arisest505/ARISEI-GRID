// src/widgets/Module/ModuleHeroSection.tsx
import { ShieldCheck, LayoutGrid } from "lucide-react";

export default function ModuleHeroSection() {
  return (
    <section className="relative w-full px-6 py-16 bg-gradient-to-br from-cyan-100 via-white to-white">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <LayoutGrid className="w-12 h-12 text-cyan-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
          Panel de Módulos
        </h1>
        <p className="mt-4 text-lg text-gray-600 md:text-xl">
          Accede a los módulos según tu rol y permisos en el sistema. 
          Todo está organizado para brindarte una experiencia clara y segura.
        </p>
      </div>

      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/world-bg.svg')] bg-cover bg-center opacity-5 pointer-events-none" />
    </section>
  );
}

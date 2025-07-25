import { Mail, Phone, Globe, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="py-10 text-sm text-gray-300 bg-black"
    >
      <div className="grid max-w-6xl gap-8 px-6 mx-auto text-center md:grid-cols-3 md:text-left">
        {/* Logo y nombre */}
        <div className="flex flex-col items-center space-y-3 md:items-start">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <img
              src="/logo.webp"
              alt="Logo ARISEI"
              className="w-[64px] h-[64px] object-contain"
            />
          </div>
          <h4 className="text-lg font-semibold text-white">ARISEI-GRID</h4>
          <p className="text-sm text-gray-400">
            Soluciones digitales con impacto humano y tecnológico.
          </p>
        </div>

        {/* Información de contacto */}
        <div className="space-y-4">
          <h5 className="mb-2 text-base font-semibold text-white">Contacto</h5>
          <p className="flex items-center justify-center gap-2 md:justify-start">
            <Mail size={18} className="text-cyan-400" />
            arisearise410@gmail.com
          </p>
          <p className="flex items-center justify-center gap-2 md:justify-start">
            <Phone size={18} className="text-cyan-400" />
            +51 902 280 461
          </p>
        </div>

        {/* Alcance */}
        <div className="space-y-4">
          <h5 className="mb-2 text-base font-semibold text-white">Cobertura</h5>
          <p className="flex items-center justify-center gap-2 md:justify-start">
            <MapPin size={18} className="text-cyan-400" />
            Operamos a nivel nacional – Perú
          </p>
          {/* <p className="flex items-center justify-center gap-2 md:justify-start">
            <Globe size={18} className="text-cyan-400" />
            www.arisei.pe
          </p> */}
          
        </div>
      </div>

      {/* Línea inferior */}
      <div className="pt-4 mt-10 text-xs text-center text-gray-500 border-t border-gray-700">
        © 2025 ARISEI-GRID. Todos los derechos reservados.
      </div>
    </footer>
  );
}

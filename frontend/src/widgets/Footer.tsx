import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      id="contact"
      className="py-10 text-sm text-gray-300 bg-black"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid max-w-6xl gap-8 px-6 mx-auto text-center md:grid-cols-3 md:text-left">
        {/* Logo y nombre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center space-y-3 md:items-start"
        >
          <div className="p-3 shadow-sm">
            <img
              src="/LogoBlanco_SOLOLOGO_IncideNETFont.svg"
              alt="Logo ARISEI"
              className="w-[64px] h-auto object-contain"
            />
          </div>
          <h4 className="text-lg font-bold text-white">IncideNET by ARISEI</h4>
          <p className="text-sm font-bold text-white">
            Soluciones digitales con impacto humano y tecnológico.
          </p>
        </motion.div>

        {/* Información de contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h5 className="mb-2 text-base font-bold text-white">Contacto</h5>
          <p className="flex items-center justify-center gap-2 font-bold md:justify-start">
            <Mail size={18} className="text-white" />
            incidenetsuport@gmail.com
          </p>
          <p className="flex items-center justify-center gap-2 font-bold md:justify-start">
            <Phone size={18} className="text-white" />
            +51 902 280 461
          </p>
          <p className="flex items-center justify-center gap-2 font-bold md:justify-start">
            <Facebook size={18} className="text-white" />
            IncideNet
          </p>
        </motion.div>

        {/* Alcance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center space-y-4 md:items-start"
        >
          <h5 className="mb-2 text-base font-bold text-white">Cobertura</h5>
          <p className="flex items-center gap-2 font-bold">
            <MapPin size={18} className="text-white" />
            Operamos a nivel nacional – Perú
          </p>
          <img
            src="/Flag_of_Peru_(state).webp"
            alt="Bandera de Perú"
            className="w-16 h-auto rounded-sm shadow-md"
          />
        </motion.div>
      </div>

      {/* Línea inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="pt-4 mt-10 text-xs font-bold text-center text-white border-t border-gray-700"
      >
        © 2025 IncideNET. Todos los derechos reservados.
      </motion.div>
    </motion.footer>
  );
}

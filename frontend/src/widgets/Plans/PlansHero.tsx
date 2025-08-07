import { motion } from "framer-motion";

export default function PlansHero() {
  return (
    <motion.section
      className="relative py-48 text-center text-cyan-400"
      style={{
        backgroundImage: "url('/06aasdas45gf3232j3k23kj323.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Capa de humo oscura */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm" />

      <motion.div
        className="relative z-10 flex flex-col items-center max-w-4xl px-6 mx-auto text-pretty"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl drop-shadow-lg">
          Elige el plan que protege a tu institución
        </h1>

        <p className="mb-4 text-lg leading-relaxed text-gray-200 md:text-xl lg:text-xl drop-shadow">
          Nuestra plataforma está diseñada para detectar y prevenir traslados con deudas,
          facilitando el control académico y financiero entre instituciones educativas.
        </p>

        <p className="text-lg leading-relaxed text-gray-300 md:text-xl lg:text-xl drop-shadow">
          Selecciona entre el acceso demo o la versión PRO con control completo de alertas,
          historial y gestión de incidencias.
        </p>
      </motion.div>
    </motion.section>
  );
}

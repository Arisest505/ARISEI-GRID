import { motion } from "framer-motion";

export default function HelpHero() {
  return (
    <section
      className="relative py-40 text-center text-black"
      style={{
        backgroundImage: "url('/05asdsad2s1g61f65gfdg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fondo humo blanco suave */}
      <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center max-w-5xl px-6 mx-auto">
        {/* Animación solo del título */}
        <motion.h1
          className="mb-4 text-4xl font-bold text-red-800 md:text-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          ¿Necesitas asistencia o soporte?
        </motion.h1>

        {/* Animación solo del párrafo */}
        <motion.p
          className="text-lg md:text-xl text-black/80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        >
          Estamos aquí para ayudarte con consultas sobre incidencias, reportes de deudas,
          validaciones institucionales y cualquier solicitud relacionada al sistema.
        </motion.p>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";

export default function ViewUserHero() {
  return (
    <section
      className="relative px-6 py-40 overflow-hidden text-white bg-center bg-cover md:px-16"
      style={{
        backgroundImage: "url('/102lkanskjbasda5ds55d54a84sd584s5.jpg')", //  Reemplaza con tu imagen real
      }}
    >
      {/* Capa oscura + blur */}
      <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

      {/* Contenido animado */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: false, amount: 0.4 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold md:text-6xl font-fancy drop-shadow-lg">
          Mis Incidencias Registradas
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg font-bold text-white/90">
          Administra, edita o elimina fácilmente las incidencias que has registrado dentro del sistema institucional.
        </p>
      </motion.div>
    </section>
  );
}

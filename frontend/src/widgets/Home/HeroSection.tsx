import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative py-40 text-center text-black"
      style={{
        backgroundImage: "url('/04aksjmlknkjbfg5h4j6h.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
      }}
    >
      {/* Fondo humo con blur blanco */}
      <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-sm" />

      {/* Contenido animado */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl px-6 mx-auto">
        <motion.img
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}

          src="/LogoNegro_SOLOLOGO_IncideNETFont.svg"
          alt="Logo ARISEI"
          className="w-[240px] h-[auto] object-contain mb-6"
        />

        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.5 }}

          className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl"
        >
          Bienvenido a <span className="text-cyan-400 bg-clip-text">IncideNET</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false, amount: 0.5 }}

          className="max-w-2xl mb-12 text-lg font-bold text-black md:text-xl"
        >
          Una plataforma moderna, escalable y flexible para gestión, administración e información educativa.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: false, amount: 0.5 }}

          href="/plans"
          className=" px-8 py-4 text-sm font-semibold text-white transition duration-300 rounded-lg shadow-sm bg-cyan-400 hover:bg-sky-500 hover:shadow-lg hover:shadow-cyan-300 hover:-translate-y-0.5 hover:scale-105 hover:text-black"
        >
          Comienza ahora
        </motion.a>
      </div>
    </section>
  );
}

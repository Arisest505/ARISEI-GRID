const CTA_TITLE = "Bienvenido a";
const SYSTEM_NAME = "ARISEI-GRID";
const DESCRIPTION =
  "Una plataforma moderna, escalable y flexible para gestión administracion y informacion de la educacion.";

export default function HeroSection() {
  return (
    <section className="py-24 text-center text-gray-900 bg-gradient-to-b from-white to-slate-100">
      <div className="flex flex-col items-center max-w-5xl px-6 mx-auto">
        <div >
          <img
            src="/logo.webp"
            alt="Logo ARISEI"
            className="w-[240px] h-[240px] object-contain  "
          />
        </div>
        <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
          {CTA_TITLE}{" "}
          <span className="text-cyan-600">{SYSTEM_NAME}</span>
        </h2>

        <p className="max-w-2xl mb-10 text-lg text-gray-600 md:text-xl">
          {DESCRIPTION}
        </p>

        <a
          href="/plans"
          className="inline-block px-8 py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-cyan-600 hover:bg-cyan-700 rounded-xl"
        >
          Comienza ahora
        </a>
      </div>
    </section>
  );
}

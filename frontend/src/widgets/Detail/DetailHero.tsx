export default function HelpHero() {
  return (
    <section
      className="relative py-32 text-center text-white bg-sky-900"
      style={{
        backgroundImage: "url('/A high-contrast, low-key overhead bird’s eye view of papeles bond in various white file folders, emphasizing deep shadows and a dramatic top-down perspective.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 max-w-5xl px-6 mx-auto">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-md md:text-5xl">
          Detalles completos de la incidencia registrada en el sistema institucional.
        </h1>
        <p className="text-lg leading-relaxed text-slate-200 md:text-xl drop-shadow-sm">
          Cada incidencia incluye información detallada sobre la persona afectada,
          la institución involucrada, el tipo de incidencia, monto de deuda (si aplica),
          fecha del incidente y cualquier familiar relacionado.
          Puedes revisar también los documentos adjuntos y el estado actual de la misma.
        </p>
      </div>
    </section>
  );
}

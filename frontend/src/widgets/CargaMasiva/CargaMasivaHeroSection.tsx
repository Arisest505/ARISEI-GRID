export default function CargaMasivaHeroSection() {
  return (
    <section className="relative py-40 shadow-md rounded-xl animate-fade-in">
      <img
        src="/02knhkjndjnf65f6d.webp" //  Reemplaza con tu ruta real
        alt="Carga Masiva"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* Capa de oscurecimiento */}
      <div className="absolute inset-0 bg-black/50 "></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        <h1 className="text-3xl font-extrabold md:text-5xl">Carga Masiva de Incidencias</h1>
        <p className="max-w-xl mt-4 text-lg md:text-xl text-white/90">
          Importa múltiples registros al sistema desde un solo archivo Excel. Ahorra tiempo, evita errores y mejora tu eficiencia.
        </p>
        <div className="mt-6">
          <a
            href="/Plantilla_Carga_Masiva_V1.xlsx" //  Ruta de descarga del archivo modelo
            className="px-6 py-3  text-black font-semibold transition rounded-lg hover:text-white bg-cyan-400 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-60 hover:shadow-lg hover:shadow-cyan-300 hover:-translate-y-0.5 hover:scale-105 shadow-sm"
            download
          >
            Descargar plantilla Excel
          </a>
        </div>
      </div>
    </section>
  );
}

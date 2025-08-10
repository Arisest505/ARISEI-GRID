// src/widgets/Common/HeroCrud.tsx
export default function HeroCrud() {
  return (
    <section
      className="relative py-40 mb-10 overflow-hidden shadow-lg rounded-xl"
      style={{
        backgroundImage: 'url("/03sadsg45f4gfsfgsd.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center text-white">
        <h1 className="text-4xl font-bold drop-shadow-lg">Panel de Gestión CRUD</h1>
        <p className="max-w-2xl mt-4 text-lg text-white/90">
          Administra todos los <strong>módulos</strong> del sistema y configura los <strong>roles</strong> con sus permisos y accesos.
        </p>
      </div>
    </section>
  );
}
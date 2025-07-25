

export default function ForoHero() {
  return (
    <header className="relative w-full h-64 bg-center bg-cover py-60" style={{ backgroundImage: 'url("6a34238-b-5a7-cf1-eeac1fee670a_Untitled_design.jpg")' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-400 bg-opacity-50">
        <h1 className="mb-2 text-4xl font-bold text-black md:text-5xl">HUB Institucional</h1>
        <p className="max-w-xl px-4 font-bold text-center text-black md:text-2xl">
          Participa, consulta y mantente informado sobre los temas más importantes que afectan a nuestra comunidad.
        </p>
      </div>
    </header>
  );
}
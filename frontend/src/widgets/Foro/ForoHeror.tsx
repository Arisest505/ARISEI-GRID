

export default function ForoHero() {
  return (
    <header className="relative w-full h-64 bg-center bg-cover py-80" style={{ backgroundImage: 'url("07asdasñklgmkh55365sad8g.webp")' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
        <h1 className="mb-2 text-4xl font-bold text-cyan-500 md:text-5xl">HUB Institucional</h1>
        <p className="max-w-xl px-4 font-bold text-center text-white md:text-2xl">
          Participa, consulta y mantente informado sobre los temas más importantes que afectan a nuestra comunidad.
        </p>
      </div>
    </header>
  );
}
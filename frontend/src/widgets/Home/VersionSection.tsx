import { Settings2, Users2, Lightbulb } from "lucide-react";

const versions = [
  {
    version: "v1.0.0",
    date: "12 Jul 2025",
    author: "ARISEI",
    icon: <Users2 className="w-6 h-6 text-cyan-600" />,
    title: "Lanzamiento inicial",
    description:
      "Primera versión funcional enfocada en registrar estudiantes con historial de deudas y compartir datos entre instituciones.",
    borderColor: "border-cyan-600",
  },
  {
    version: "v1.1.0",
    date: "25 Ago 2025",
    author: "ARISEI",
    icon: <Settings2 className="w-6 h-6 text-violet-600" />,
    title: "Gestión institucional",
    description:
      "Se incorporó el módulo para que las instituciones configuren alertas, gestionen incidencias y personalicen políticas de admisión.",
    borderColor: "border-violet-600",
  },
  {
    version: "v1.2.0",
    date: "10 Sep 2025",
    author: "ARISEI",
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: "Detección inteligente",
    description:
      "Se implementó un sistema con IA para detectar patrones de fraude académico y reincidencia en deudas entre estudiantes.",
    borderColor: "border-yellow-500",
  },
];

export default function VersionSection() {
  return (
    <section id="versions" className="py-20 text-gray-900 bg-white">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Historial de versiones
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Revisa cómo el sistema ha evolucionado para combatir el fraude académico y proteger la integridad de las instituciones.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {versions.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl bg-gray-50 border-l-4 shadow-md hover:shadow-lg transition-all duration-300 ${item.borderColor}`}
            >
              <div className="flex items-center mb-3 space-x-3">
                {item.icon}
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <p className="mb-2 text-sm text-gray-500">
                {item.date} – por <span className="font-medium">{item.author}</span>
              </p>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="mt-4 text-xs text-gray-400">Versión: {item.version}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

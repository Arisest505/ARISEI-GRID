import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, FileSearch, Gavel, Ban } from "lucide-react";

const ABOUT_INTRO = `Nuestra plataforma combate la informalidad financiera académica,
informando a las instituciones sobre estudiantes con historial de deudas no resueltas entre otras incidencias educativas.`;

const ABOUT_PARAGRAPH = `Alertamos sobre posibles morosidades, compartimos información segura del historial
crediticio y promovemos normativas justas entre instituciones educativas para proteger
la salud financiera del sistema educativo.`;

const aboutItems = [
  {
    icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
    title: "Prevención de deudas",
    description:
      "Emitimos alertas a tiempo para evitar la inscripción de estudiantes con historial moroso en otras instituciones.",
  },
  {
    icon: <FileSearch className="w-10 h-10 text-blue-600" />,
    title: "Historial crediticio académico",
    description:
      "Consulta el comportamiento financiero de estudiantes en sus instituciones anteriores antes de admitirlos.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
    title: "Sistema confiable",
    description:
      "Información validada, segura y compartida entre instituciones educativas autorizadas para mayor transparencia.",
  },
  {
    icon: <Gavel className="w-10 h-10 text-indigo-600" />,
    title: "Normativas justas",
    description:
      "Fomentamos acuerdos institucionales para estandarizar criterios sobre deudas y protección legal educativa.",
  },
  {
    icon: <Ban className="w-10 h-10 text-yellow-600" />,
    title: "Incidencias registradas",
    description:
      "Llevamos control total de avisos, advertencias y bloqueos temporales en el sistema por incumplimientos.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-20 text-gray-900 bg-white" id="about">
      <div className="max-w-6xl px-6 mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.5 }}
          className="mb-6 text-3xl font-bold md:text-4xl"
        >
          ¿Qué es este sistema?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: false, amount: 0.5 }}
          className="max-w-3xl mx-auto mb-4 text-lg text-gray-700"
        >
          {ABOUT_INTRO}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: false, amount: 0.5 }}
          className="max-w-3xl mx-auto mb-12 text-gray-600 text-md"
        >
          {ABOUT_PARAGRAPH}
        </motion.p>

        <div className="grid gap-8 text-left md:grid-cols-3">
          {aboutItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: false, amount: 0.4 }}
              className="p-6 transition-all duration-300 bg-gray-100 shadow-md hover:bg-gray-200 rounded-xl"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

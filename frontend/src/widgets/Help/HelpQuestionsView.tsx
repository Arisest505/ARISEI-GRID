import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const mockQuestions = [
  {
    id: 1,
    title: "¿Cómo puedo consultar si un estudiante tiene deudas activas?",
    description:
      "Desde el panel institucional, accede al módulo 'Historial de incidencias' e ingresa el ID del estudiante.",
  },
  {
    id: 2,
    title: "¿Qué sucede cuando se registra una deuda en el sistema?",
    description:
      "Se genera una alerta visible para otras instituciones conectadas al sistema. El estudiante es notificado automáticamente.",
  },
  {
    id: 3,
    title: "¿Puedo reportar a un estudiante con documentación pendiente?",
    description:
      "Sí. El sistema permite adjuntar evidencia, establecer un tipo de incidencia y asignar una gravedad.",
  },
];

export default function HelpQuestionsView() {
  return (
    <section className="py-20 text-gray-900 bg-gray-50" id="view-questions">
      <div className="max-w-5xl px-6 mx-auto">
        {/* Título animado */}
        <motion.h2
          className="mb-10 text-3xl font-bold text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          Consultas frecuentes
        </motion.h2>

        {/* Tarjetas de preguntas animadas */}
        <div className="grid gap-6 md:grid-cols-2">
          {mockQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              className="p-6 transition bg-white border rounded-lg shadow-md hover:shadow-cyan-400/30 hover:bg-cyan-50 hover:border-cyan-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-cyan-600">
                <MessageSquare size={20} />
                {q.title}
              </div>
              <p className="text-gray-700">{q.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

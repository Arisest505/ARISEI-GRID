import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "¿Qué es IncideNET?",
    answer:
      "Es una plataforma digital que permite a las instituciones educativas registrar, consultar y compartir información sobre deudas estudiantiles no saldadas.",
  },
  {
    question: "¿Cuál es su objetivo principal?",
    answer:
      "Prevenir fraudes académicos derivados de traslados con deudas pendientes, protegiendo la salud financiera de las instituciones.",
  },
  {
    question: "¿Qué información se comparte entre instituciones?",
    answer:
      "Solo datos relevantes y autorizados sobre historial de pagos, incidencias y bloqueos, bajo normativas de seguridad y ética.",
  },
  {
    question: "¿Los estudiantes son notificados?",
    answer:
      "Sí. Los estudiantes reciben notificaciones formales cuando una institución registra una deuda o incidencia en el sistema.",
  },
  {
    question: "¿Qué instituciones pueden usarlo?",
    answer:
      "Colegios, universidades, institutos, academias y cualquier entidad educativa que desee implementar control financiero interno.",
  },
  {
    question: "¿Es legal compartir esta información?",
    answer:
      "Sí. Toda la plataforma opera bajo términos aceptados por las partes involucradas y respeta las leyes de protección de datos vigentes.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 text-gray-900 bg-white">
      <div className="max-w-4xl px-6 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-3xl font-bold text-center md:text-4xl"
        >
          Preguntas frecuentes
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="overflow-hidden transition-all duration-300 border-l-4 shadow-md border-cyan-500 bg-gray-50 rounded-xl hover:shadow-lg"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex items-center justify-between w-full px-6 py-4 font-medium text-left text-gray-900 focus:outline-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-cyan-600" : ""
                    }`}
                  />
                </button>

                <div
                  className={`px-6 pb-4 text-sm text-gray-700 transition-all duration-500 ${
                    isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  {item.answer}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

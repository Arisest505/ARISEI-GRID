import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Qué es ARISEI-GRID?",
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
        <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">
          Preguntas frecuentes
        </h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="overflow-hidden transition-all duration-300 border-l-4 shadow-md border-cyan-600 bg-gray-50 rounded-xl"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex items-center justify-between w-full px-6 py-4 font-medium text-left text-gray-900 focus:outline-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`px-6 pb-4 text-sm text-gray-700 transition-all duration-300 ${
                    isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

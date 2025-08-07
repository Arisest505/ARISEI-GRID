import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "¿Dónde veo mi Nombre y Código o ID?",
    answer:
      "Para ver tu ID o Código de activación junto a tu Nombre de usuario, debes estar registrado en el sistema e iniciar sesión. Luego haz clic en el icono de usuario en la esquina superior derecha (NAVBAR) para ver tu información.",
  },
  {
    question: "¿Qué incluye la versión demo?",
    answer:
      "Acceso limitado durante 7 días. Permite visualizar deudas, incidencias básicas y probar funcionalidades clave.",
  },
  {
    question: "¿Cómo puedo activar el plan PRO y sus versiones?",
    answer:
      "Desde la tarjeta del plan PRO, escanea el código QR visible, realiza el pago, e ingresa tu nombre de usuario y código ID para validar tu activación.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Actualmente aceptamos pagos mediante Yape y Plin. Escanea el código QR, realiza el pago, y tu activación se procesará en un máximo de 2 días.",
  },
  {
    question: "¿Qué beneficios exclusivos ofrece el plan PRO?",
    answer:
      "Incluye control total del sistema: registro de deudas, alertas automatizadas, historial académico, incidencias compartidas entre instituciones y soporte prioritario.",
  },
  {
    question: "¿Puedo cambiar de plan más adelante?",
    answer: "Sí, puedes cambiar de plan en cualquier momento.",
  },
  {
    question: "¿Puedo usar solo el foro institucional?",
    answer: "Sí. Por el momento.",
  },
];

export default function PlansFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 text-gray-900 bg-gray-50">
      <div className="max-w-4xl px-6 mx-auto">
        <motion.h2
          className="mb-12 text-3xl font-bold text-center md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          Preguntas frecuentes
        </motion.h2>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                viewport={{ once: false, amount: 0.1 }}
                className={`border border-gray-200 rounded-lg shadow-sm transition-all duration-300 ${
                  isOpen ? "bg-white shadow-md" : "bg-white"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3 text-lg font-medium text-gray-800">
                    <HelpCircle className="w-5 h-5 text-cyan-600" />
                    <span>{item.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 transition-transform text-cyan-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
                  )}
                </button>

                <div
                  className={`px-6 overflow-hidden text-sm text-gray-700 transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "max-h-[300px] py-2 opacity-100"
                      : "max-h-0 py-0 opacity-0"
                  }`}
                >
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

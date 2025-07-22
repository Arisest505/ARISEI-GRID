import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "¿Qué incluye la versión demo?",
    answer:
      "Acceso limitado durante 7 días al foro institucional y sistema de estudiantes. Permite visualizar deudas, incidencias básicas y probar funcionalidades clave.",
  },
  {
    question: "¿Cómo puedo activar el plan PRO?",
    answer:
      "Desde la tarjeta del plan PRO, escanea el código QR visible en la misma pantalla. Luego, ingresa tu nombre de usuario y código ID para validar tu activación.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos pagos mediante Yape y Plin. Escanea el código QR mostrado, realiza el pago y tu activación se procesará en máximo 2 días.",
  },
  {
    question: "¿Qué beneficios exclusivos ofrece el plan PRO?",
    answer:
      "Incluye control total del sistema: registro de deudas, alertas automatizadas, historial académico, incidencias compartidas entre instituciones y soporte prioritario.",
  },
  {
    question: "¿Puedo cambiar de plan más adelante?",
    answer:
      "No. Ya que la version demo es solo para prueba y sera solo una vez por correo, Pero puedes cancelar tu suscripción en cualquier momento dejando de pagar.",
  },
  {
    question: "¿Puedo usar solo el foro institucional?",
    answer:
      "Si. Por el momento.",
  },
];

export default function PlansFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50 text-gray-900" id="faq">
      <div className="max-w-4xl px-6 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">
          Preguntas frecuentes
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`border border-gray-200 rounded-lg shadow-sm transition-all duration-300 ${
                  isOpen ? "bg-white shadow-md" : "bg-white"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3 text-lg font-medium text-gray-800">
                    <HelpCircle className="w-5 h-5 text-cyan-600" />
                    <span>{item.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-600 transition-transform" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
                  )}
                </button>

                <div
                  className={`px-6 overflow-hidden text-sm text-gray-700 transition-all duration-300 ${
                    isOpen ? "max-h-[300px] py-2" : "max-h-0 py-0"
                  }`}
                >
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

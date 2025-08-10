// PlansAbout.tsx
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Users, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";






interface PlanCard {
  name: string;
  price: string;
  services: string[];
  description: string;
  features: string[];
  borderColor: string;
  bgColor: string;
  highlight: boolean;
  icon: ReactNode;
  oldPrice?: string;
  offerTag?: string;
}


const SUPPORT = {
  phone: "+51 902 280 461",
  email: "incidenetsuport@gmail.com",
  anchorId: "contacts", // id del bloque de contacto en el footer/página de Contacto
};

const plans: PlanCard[] = [
  {
    name: "Demo",
    price: "Gratis por 7 días",
    services: ["Foro Institucional"],
    description:
      "Evalúa nuestra plataforma con funciones básicas enfocadas en control académico y alertas institucionales.",
    features: [
      "Prueba del sistema de alertas por deudas",
      "Visualización limitada de incidencias",
      "Soporte básico vía correo",
    ],
    borderColor: "border-slate-400",
    bgColor: "bg-slate-50",
    highlight: false,
    icon: <AlertTriangle className="w-6 h-6 text-gray-500" />,
  },
  {
    name: "PRO Mensual",
    price: "S/ 50 /mes",
    services: ["Foro Institucional"],
    description:
      "Acceso completo para instituciones educativas al sistema de incidencias y control académico-financiero.",
    features: [
      "Sistema de alertas automatizadas",
      "Historial académico y de deudas",
      "Publicación y gestión de incidencias",
      "Carga Masiva de Incidencias",
      "Soporte prioritario",
    ],
    borderColor: "border-cyan-400",
    bgColor: "bg-cyan-50",
    highlight: true,
    icon: <Users className="w-6 h-6 text-cyan-400" />,
  },
  {
    name: "PRO Semestral",
    price: "S/ 279 /6 meses",
    oldPrice: "S/ 300",
    offerTag: "¡Ahorra 7%!",
    services: ["Foro Institucional"],
    description:
      "Accede durante medio año con un descuento exclusivo. Ideal para campañas educativas o proyectos institucionales a mediano plazo.",
    features: [
      "Todos los beneficios del plan PRO",
      "6 meses de servicio continuo",
      "Precio preferencial sin recargos mensuales",
      "Carga Masiva de Incidencias",
    ],
    borderColor: "border-red-500",
    bgColor: "bg-sky-50",
    highlight: true,
    icon: <Users className="w-6 h-6 text-red-700" />,
  },
  {
    name: "PRO Anual",
    price: "S/ 540 /año",
    oldPrice: "S/ 600",
    offerTag: "¡Descuento especial 10%!",
    services: ["Foro Institucional"],
    description:
      "La mejor opción para instituciones que buscan estabilidad, soporte continuo y ahorro garantizado.",
    features: [
      "Todos los beneficios del plan PRO",
      "12 meses continuos sin interrupciones",
      "Descuento especial por suscripción anual",
      "Atención preferencial para nuevos módulos",
      "Carga Masiva de Incidencias",
    ],
    borderColor: "border-violet-500",
    bgColor: "bg-indigo-50",
    highlight: true,
    icon: <Users className="w-6 h-6 text-violet-800" />,
  },
];

function handlePlanClick(plan: PlanCard) {
  const isDemo = plan.name.toLowerCase() === "demo";

  if (isDemo) {
    toast(
      `Para activar el plan Demo, contáctate con soporte al ${SUPPORT.phone} o ${SUPPORT.email}. También puedes ir al final de la página.`,
      {
        icon: <AlertTriangle className="w-6 h-6 text-gray-500" />,
        
      }
    );
    return;
  }

  toast("Para activar este plan, llena el formulario de activación y paga el monto del plan preferido.");
}

export default function PlansAbout() {
  return (
    <section className="py-20 text-gray-900 bg-white" id="planes">
      <div className="mx-auto text-center max-w-7xl">
        <h2 className="mb-12 text-4xl font-extrabold tracking-tight text-slate-800">
          Nuestros planes
        </h2>

        <div className="grid grid-cols-1 gap-6 px-2 mx-auto sm:grid-cols-2 lg:grid-cols-4 max-w-7xl">
          {plans.map((plan, idx) => {
            const isDemo = plan.name.toLowerCase() === "demo";
            return (
              <motion.div
                key={plan.name}
                className={clsx(
                  "relative border-4 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-cyan-300 transition-all duration-500 flex flex-col justify-between w-full bg-white",
                  plan.borderColor,
                  plan.bgColor,
                  plan.highlight && "hover:scale-[1.03]"
                )}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.7, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.5 }}
                whileHover={{ rotateX: 4, rotateY: 2 }}
              >
                {plan.offerTag && (
                  <div className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-bl-lg shadow-sm animate-pulse">
                    {plan.offerTag}
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    {plan.icon}
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-extrabold text-cyan-700">{plan.price}</span>
                  {plan.oldPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">{plan.oldPrice}</span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Incluye:</p>
                  <ul className="space-y-1 text-sm text-black list-disc list-inside">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {plan.services.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 text-xs font-bold text-white transition-transform rounded-full shadow-inner bg-gradient-to-r from-cyan-400 to-cyan-600 hover:scale-105"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  className={clsx(
                    "w-full px-4 py-2 text-sm font-semibold text-white transition duration-300 rounded-lg shadow-sm hover:shadow-xl hover:scale-105",
                    isDemo ? "bg-slate-700 hover:bg-slate-800" : "bg-cyan-500 hover:bg-sky-600"
                  )}
                  onClick={() => handlePlanClick(plan)}
                  aria-label={isDemo ? "Solicitar Demo" : "Activar plan"}
                >
                  {isDemo ? "Solicitar Demo" : "¡Lo quiero!"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

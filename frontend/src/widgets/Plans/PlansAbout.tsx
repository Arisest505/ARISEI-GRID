import { Users, AlertTriangle } from "lucide-react";
import yapeIcon from "/yape.png";
import plinIcon from "/plin.jpg";
import qrImage from "/qr-code.jpg";

const plans = [
  {
    name: "Demo",
    price: "Gratis por 7 días",
    services: ["Foro Institucional"],
    description:
      "Evalúa nuestra plataforma con funciones básicas enfocadas en control académico y alertas institucionales.",
    features: [
      "Prueba de sistema de alertas por deudas",
      "Visualización limitada de incidencias",
      "Soporte básico vía correo",
    ],
    color: "border-gray-400",
    icon: <AlertTriangle className="w-6 h-6 text-gray-500" />,
  },
  {
    name: "PRO",
    price: "S/ 119 /mes",
    services: ["Foro Institucional"],
    description:
      "Control total de deudas, historial académico-financiero y gestión entre instituciones educativas.",
    features: [
      "Registro y consulta de historial de deudas estudiantiles",
      "Foro institucional con sistema de incidencias activado",
      "Hasta 600 revisiones de casos mensuales",
      "Modelos de alertas y notificaciones automatizadas",
    ],
    color: "border-cyan-600",
    icon: <Users className="w-6 h-6 text-cyan-600" />,
  },
];

export default function PlansAbout() {
  return (
    <section className="py-20 text-gray-900 bg-white" id="planes">
      <div className="max-w-7xl px-6 mx-auto text-center">
        <h2 className="mb-12 text-3xl font-bold md:text-4xl">Nuestros planes</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Demo y PRO */}
          <div className="col-span-2 flex flex-wrap justify-center gap-6">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`border-l-4 ${plan.color} bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-left flex flex-col h-[500px] w-full max-w-[300px]`}
              >
                <div className="flex items-center mb-4 space-x-3">
                  {plan.icon}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>

                <p className="mb-2 text-gray-600">{plan.description}</p>
                <p className="mb-4 text-2xl font-bold text-cyan-700">{plan.price}</p>

                <div className="mb-2">
                  <p className="mb-1 text-sm font-semibold text-gray-500">Incluye:</p>
                  <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                    {plan.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500">Servicios disponibles:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {plan.services.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* QR Activation Panel */}
          <div className="hidden lg:flex flex-col items-center justify-start bg-white shadow-lg border border-cyan-200 rounded-xl p-6 h-[500px] animate-fade-in">
            <h4 className="text-lg font-semibold text-cyan-700 mb-4">Activación PRO</h4>
            <img src={qrImage} alt="QR Code" className="w-32 h-32 mb-3" />
            <p className="text-sm text-gray-600 text-center mb-4">
              Escanea el código QR para iniciar tu activación.
            </p>
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full px-3 py-2 mb-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="text"
              placeholder="ID / Código de usuario"
              className="w-full px-3 py-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-xs text-gray-500 text-center mt-2 mb-3">
              Activación válida hasta 2 días después del pago.
            </p>

            <div className="flex justify-center gap-6 mb-4">
              <div className="flex flex-col items-center text-xs text-gray-600">
                <img src={yapeIcon} alt="Yape" className="w-10 h-10 rounded-full mb-1" />
                <span>Yape</span>
              </div>
              <div className="flex flex-col items-center text-xs text-gray-600">
                <img src={plinIcon} alt="Plin" className="w-10 h-10 rounded-full mb-1" />
                <span>Plin</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 transition">
              Confirmar activación
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
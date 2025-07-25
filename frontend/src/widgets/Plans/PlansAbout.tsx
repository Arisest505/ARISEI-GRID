// PlansAbout.tsx
import { useState } from "react";
import { Users, AlertTriangle, Info } from "lucide-react";
import yapeIcon from "/yape.png";
import plinIcon from "/plin.jpg";
import qrImage from "/qr-code.jpg";
import { toast } from "sonner";
import clsx from "clsx";

const plans = [
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
    color: "border-gray-400 bg-white",
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
      "Soporte prioritario",
    ],
    color: "border-cyan-600 bg-cyan-50",
    highlight: true,
    icon: <Users className="w-6 h-6 text-cyan-700" />,
  },
  {
    name: "PRO Semestral",
    price: "S/ 270 /6 meses",
    oldPrice: "S/ 300",
    offerTag: "¡Ahorra 10%!",
    services: ["Foro Institucional"],
    description:
      "Accede durante medio año con un descuento exclusivo. Ideal para campañas educativas o proyectos institucionales a mediano plazo.",
    features: [
      "Todos los beneficios del plan PRO",
      "6 meses de servicio continuo",
      "Precio preferencial sin recargos mensuales",
    ],
    color: "border-green-600 bg-green-50",
    highlight: true,
    icon: <Users className="w-6 h-6 text-green-700" />,
  },
  {
    name: "PRO Anual",
    price: "S/  522 /año",
    oldPrice: "S/ 600",
    offerTag: "¡Descuento especial 13%!",
    services: ["Foro Institucional"],
    description:
      "La mejor opción para instituciones que buscan estabilidad, soporte continuo y ahorro garantizado.",
    features: [
      "Todos los beneficios del plan PRO",
      "12 meses continuos sin interrupciones",
      "Descuento especial por suscripción anual",
      "Atención preferencial para nuevos módulos",
    ],
    color: "border-purple-600 bg-purple-50",
    highlight: true,
    icon: <Users className="w-6 h-6 text-purple-700" />,
  },
];

export default function PlansAbout() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivacion = async () => {
    if (!nombreUsuario || !codigoUsuario) {
      toast.error("Completa ambos campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/pagos/solicitar-activacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario, codigoUsuario }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Solicitud enviada correctamente.");
        setNombreUsuario("");
        setCodigoUsuario("");
      } else {
        toast.error(data?.error || "Error en la activación");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <section className="py-20 text-gray-900 bg-white" id="planes">
      <div className="mx-auto text-center max-w-7xl">
        <h2 className="mb-12 text-3xl font-bold md:text-4xl">Nuestros planes</h2>

        {/* Planes */}
<div className="flex-auto w-full py-20 pt-20 mx-auto max-w-screen-3xl">
  <div className="flex gap-6 px-2 min-w-max">

          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={clsx(
                "relative border-l-4 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500 transition-all duration-300 flex flex-col justify-between w-full max-w-[320px] h-[520px] bg-white",
                plan.color,
                plan.highlight && "scale-[1.02]"
              )}
            >
              {plan.offerTag && (
                <div className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-bl-lg shadow-sm animate-bounce">
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
                <ul className="space-y-1 text-sm text-gray-800 list-disc list-inside">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {plan.services.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs font-bold rounded-full shadow-inner bg-gradient-to-r from-cyan-200 to-cyan-500 text-cyan-900"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <button
                className="flex items-center justify-center w-full gap-2 py-2 text-sm font-semibold text-white transition duration-200 rounded-lg bg-cyan-700 hover:bg-cyan-800"
                onClick={() => {
                  if (plan.name === "Demo") {
                    toast("Contáctate con nosotros para obtener este plan.", { icon: <Info className='w-5 h-5 text-yellow-500' /> });
                  } else {
                    toast("Para activar este plan, llena el formulario de activación y pagar el monto del plan preferido.", { icon: <Info className='w-5 h-5 text-cyan-600' /> });
                  }
                }}
              >
                ¡Lo quiero!
              </button>
            </div>
          ))}
        </div>
      </div>

        {/* Formulario QR */}
        <div className="flex flex-col items-center justify-start w-full max-w-lg p-6 mx-auto bg-white border shadow-lg border-cyan-200 rounded-xl animate-fade-in">
          <h4 className="mb-4 text-lg font-semibold text-cyan-700">Activación PRO</h4>
          <img src={qrImage} alt="QR Code" className="w-32 h-32 mb-3" />
          <p className="mb-4 text-sm text-center text-gray-600">
            Escanea el código QR y transfiere el monto exacto del plan seleccionado. Luego completa los datos para validar tu activación.
          </p>

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="ID / Código de usuario"
            value={codigoUsuario}
            onChange={(e) => setCodigoUsuario(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <p className="mt-2 mb-3 text-xs text-center text-gray-500">
            Activación válida hasta 2 días después del pago.
          </p>

          <div className="flex justify-center gap-6 mb-4">
            <div className="flex flex-col items-center text-xs text-gray-600">
              <img src={yapeIcon} alt="Yape" className="w-10 h-10 mb-1 rounded-full" />
              <span>Yape</span>
            </div>
            <div className="flex flex-col items-center text-xs text-gray-600">
              <img src={plinIcon} alt="Plin" className="w-10 h-10 mb-1 rounded-full" />
              <span>Plin</span>
            </div>
          </div>

          <button
            onClick={handleActivacion}
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-semibold text-white transition rounded-lg bg-cyan-700 hover:bg-cyan-800"
          >
            {loading ? "Enviando..." : "Confirmar activación"}
          </button>
        </div>

      </div>
    </section>
  );
}
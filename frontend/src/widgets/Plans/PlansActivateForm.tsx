// PlansActivateForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import yapeIcon from "/yape.png";
import plinIcon from "/plin.jpg";
import qrImage from "/qr-code.jpg";
import { User, KeyRound } from "lucide-react";

export default function PlansActivateForm() {
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
    <section
      id="formulario-activacion"
      className="w-full bg-white border-t border-gray-100"
    >
      <div className="flex flex-col items-center justify-center w-full px-4 py-20 mx-auto max-w-7xl">
        <div className="flex flex-col w-full max-w-6xl overflow-hidden bg-white border shadow-2xl rounded-2xl md:flex-row border-cyan-200">
          {/* Lado QR */}
          <div className="flex flex-col items-center justify-center w-full gap-6 px-10 py-14 text-center md:w-[45%] bg-gradient-to-br from-white via-white to-cyan-50">
            <motion.h4
              className="mb-3 text-2xl font-bold text-cyan-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.5 }}

            >
              Tarjeta de Activación PRO
            </motion.h4>
            <motion.img
              src={qrImage}
              alt="QR Code"
              className="shadow-2xl w-80 h-80 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.5 }}

            />
            <motion.p
              className="max-w-sm text-sm text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false, amount: 0.5 }}

            >
              Escanea el código QR y transfiere el monto del plan preferido. Luego llena el formulario para completar tu activación.
            </motion.p>
          </div>

          {/* Línea divisora */}
          <div className="hidden w-px bg-gray-200 md:block"></div>

          {/* Formulario */}
          <motion.div
            className="flex flex-col justify-center w-full gap-4 px-10 py-14 md:w-[55%]"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: false, amount: 0.5 }}

          >
            <h4 className="mb-4 text-2xl font-bold text-cyan-800">Validar Activación</h4>

            <div className="relative">
              <User className="absolute w-4 h-4 text-cyan-600 left-3 top-3.5" />
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute w-4 h-4 text-cyan-600 left-3 top-3.5" />
              <input
                type="text"
                placeholder="ID / Código de usuario"
                value={codigoUsuario}
                onChange={(e) => setCodigoUsuario(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Activación válida hasta 2 días después del pago.
            </p>

            <div className="flex justify-center gap-10 my-4">
              <div className="flex flex-col items-center text-xs text-gray-600">
                <img src={yapeIcon} alt="Yape" className="w-12 h-12 mb-1 rounded-full shadow-md" />
                <span>Yape</span>
              </div>
              <div className="flex flex-col items-center text-xs text-gray-600">
                <img src={plinIcon} alt="Plin" className="w-12 h-12 mb-1 rounded-full shadow-md" />
                <span>Plin</span>
              </div>
            </div>

            <button
              onClick={handleActivacion}
              disabled={loading}
              className="px-6 py-3 text-sm font-semibold text-white transition duration-300 rounded-md shadow-lg bg-cyan-500 hover:bg-sky-600 hover:shadow-xl"
            >
              {loading ? "Enviando..." : "Confirmar activación"}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

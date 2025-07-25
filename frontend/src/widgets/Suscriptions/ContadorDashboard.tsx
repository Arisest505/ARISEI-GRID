import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  User,
  LockKeyhole,
  CreditCard,
  CalendarDays,
  Activity,
} from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
}

interface PagoPendiente {
  id: string;
  usuario: Usuario;
  codigo_usuario_ingresado: string;
  metodo_pago: string;
  fecha_pago: string;
  qr_usado_url?: string;
}

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  duracion_meses: number;
}

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

export default function ContadorDashboard() {
  const [pagosPendientes, setPagosPendientes] = useState<PagoPendiente[]>([]);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionPlanPorPago, setSeleccionPlanPorPago] = useState<{
    [pagoId: string]: string;
  }>({});

  const fetchPendientes = async () => {
    try {
      const res = await fetch(`${API_URL}/pagos/pendientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudieron obtener los pagos.");
      const data = await res.json();
      setPagosPendientes(data || []);
    } catch (err) {
      console.error("[ERROR_FETCH_PAGOS]", err);
      toast.error("Error al cargar pagos pendientes.");
    }
  };

  const fetchPlanes = async () => {
    try {
      const res = await fetch(`${API_URL}/pagos/planes-disponibles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudieron obtener los planes.");
      const data = await res.json();
      setPlanes(data || []);
    } catch (err) {
      console.error("[ERROR_FETCH_PLANES]", err);
      toast.error("Error al cargar los planes.");
    }
  };

  const cargarDatosIniciales = async () => {
    setCargando(true);
    await Promise.all([fetchPendientes(), fetchPlanes()]);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const obtenerPlanPorId = (planId: string) =>
    planes.find((plan) => plan.id === planId);

  const aprobarSolicitud = async (
    pagoId: string,
    usuarioId: string,
    planId: string
  ) => {
    if (!planId) {
      toast.error("Selecciona un plan antes de aprobar.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/pagos/aprobar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pagoId, usuarioId, planId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Activación completada.");
        fetchPendientes(); // recarga solo los pagos, no todo
      } else {
        toast.error(data?.error || "Error al aprobar el pago.");
      }
    } catch (err) {
      console.error("[ERROR_APROBAR]", err);
      toast.error("Error de red al aprobar solicitud.");
    }
  };

  return (
    <section className="px-6 py-10 mx-auto max-w-7xl animate-fade-in">
      <h2 className="flex items-center gap-3 mb-8 text-3xl font-bold tracking-tight text-cyan-700">
        <Activity className="w-6 h-6" />
        Solicitudes de Activación Pendientes
        <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-red-400 rounded-full shadow">
          {pagosPendientes.length}
        </span>
      </h2>

      {cargando ? (
        <div className="py-8 text-center">
          <p className="flex items-center justify-center gap-2 text-gray-500 animate-pulse">
            <Activity className="w-5 h-5 animate-spin" />
            Cargando solicitudes...
          </p>
        </div>
      ) : pagosPendientes.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            No hay solicitudes pendientes por ahora.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pagosPendientes.map((pago) => (
            <div
              key={pago.id}
              className="relative p-5 transition duration-300 border shadow-md group bg-gradient-to-br from-white via-gray-50 to-cyan-50 border-cyan-100 rounded-xl hover:shadow-xl"
            >
              <div className="space-y-1 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-600" />
                  <span className="font-semibold text-cyan-700">Usuario:</span>{" "}
                  {pago.usuario.nombre} ({pago.usuario.correo})
                </p>
                <p className="flex items-center gap-2">
                  <LockKeyhole className="w-4 h-4 text-cyan-600" />
                  <span className="font-semibold text-cyan-700">Código:</span>{" "}
                  {pago.codigo_usuario_ingresado}
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-600" />
                  <span className="font-semibold text-cyan-700">Método:</span>{" "}
                  {pago.metodo_pago}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-cyan-600" />
                  <span className="font-semibold text-cyan-700">Fecha:</span>{" "}
                  {format(new Date(pago.fecha_pago), "dd/MM/yyyy HH:mm")}
                </p>
              </div>

              {pago.qr_usado_url && (
                <div className="my-4">
                  <img
                    src={pago.qr_usado_url}
                    alt="QR usado"
                    className="object-cover border rounded-lg shadow w-28 h-28 border-cyan-200"
                  />
                </div>
              )}

              <div className="mt-4">
                <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-600">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  Elegir Plan
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const selectedPlanId = e.target.value;
                    setSeleccionPlanPorPago((prev) => ({
                      ...prev,
                      [pago.id]: selectedPlanId,
                    }));
                    aprobarSolicitud(pago.id, pago.usuario.id, selectedPlanId);
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="" disabled>
                    -- Selecciona un plan --
                  </option>
                  {planes.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombre} – S/ {plan.precio} ({plan.duracion_meses}{" "}
                      meses)
                    </option>
                  ))}
                </select>

                {seleccionPlanPorPago[pago.id] && (
                  <div className="mt-2 text-sm text-cyan-700">
                    <span className="font-semibold">Precio: </span>
                    S/{" "}
                    {obtenerPlanPorId(seleccionPlanPorPago[pago.id])?.precio ||
                      "—"}{" "}
                    (
                    {
                      obtenerPlanPorId(seleccionPlanPorPago[pago.id])
                        ?.duracion_meses || "?"
                    }{" "}
                    meses)
                  </div>
                )}
              </div>

              <div className="absolute px-2 py-1 text-xs font-semibold rounded-full top-2 right-2 bg-cyan-200 text-cyan-800">
                #{pago.id.slice(0, 6).toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

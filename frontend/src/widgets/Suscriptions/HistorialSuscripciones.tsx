import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarCheck, CalendarX2, FileText, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { apiFetch } from "../../lib/api"; // 👈 usa tu helper

interface Suscripcion {
  id: string;
  usuario: { nombre: string; correo: string; codigo: string };
  plan: { nombre: string; precio: number; duracion_meses: number };
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  activado_por_usuario?: { nombre: string };
  pago?: { medio_verificado: boolean };
}

export default function HistorialSuscripciones() {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuscripciones = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/suscripciones/historial-verificadas");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[ERROR_FETCH_VERIFICADAS]", errorText);
        toast.error("No autorizado o error al obtener suscripciones.");
        setSuscripciones([]);
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.warn("⚠️ Respuesta inválida del servidor:", data);
        toast.error("Respuesta inesperada del servidor.");
        setSuscripciones([]);
        return;
      }

      setSuscripciones(data);
    } catch (err) {
      console.error("[ERROR_FETCH_VERIFICADAS]", err);
      toast.error("Error de red al obtener suscripciones.");
      setSuscripciones([]);
    } finally {
      setLoading(false);
    }
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      suscripciones.map((s) => ({
        Usuario: s.usuario.nombre,
        Codigo: s.usuario.codigo,
        Correo: s.usuario.correo,
        Plan: s.plan.nombre,
        Precio: `S/ ${s.plan.precio}`,
        "Duración (meses)": s.plan.duracion_meses,
        "Inicio": format(new Date(s.fecha_inicio), "dd/MM/yyyy"),
        "Fin": format(new Date(s.fecha_fin), "dd/MM/yyyy"),
        "Activado por": s.activado_por_usuario?.nombre || "—",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suscripciones");
    XLSX.writeFile(workbook, "HistorialSuscripciones.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Usuario", "Código", "Correo", "Plan", "Precio", "Duración", "Inicio", "Fin", "Activado por"]],
      body: suscripciones.map((s) => [
        s.usuario.nombre,
        s.usuario.codigo,
        s.usuario.correo,
        s.plan.nombre,
        `S/ ${s.plan.precio}`,
        s.plan.duracion_meses,
        format(new Date(s.fecha_inicio), "dd/MM/yyyy"),
        format(new Date(s.fecha_fin), "dd/MM/yyyy"),
        s.activado_por_usuario?.nombre || "—",
      ]),
    });
    doc.save("HistorialSuscripciones.pdf");
  };

  useEffect(() => {
    fetchSuscripciones();
  }, []);

  return (
    <section className="max-w-6xl px-4 py-10 mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyan-800">
          Historial de Suscripciones Verificadas
        </h2>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            <FileDown className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando historial...</p>
      ) : suscripciones.length === 0 ? (
        <p className="text-gray-500">No hay suscripciones con pago verificado.</p>
      ) : (
        <div className="space-y-4">
          {suscripciones.map((sus) => {
            const vencida = new Date(sus.fecha_fin) < new Date();

            return (
              <div
                key={sus.id}
                className="p-4 transition bg-white border border-gray-200 rounded-lg shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Usuario:</strong> {sus.usuario.nombre} ({sus.usuario.codigo})
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Plan:</strong> {sus.plan.nombre} — S/ {sus.plan.precio}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Inicio:</strong>{" "}
                      {format(new Date(sus.fecha_inicio), "dd/MM/yyyy")}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Fin:</strong>{" "}
                      {format(new Date(sus.fecha_fin), "dd/MM/yyyy")}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <strong>Estado:</strong>{" "}
                      {vencida ? (
                        <span className="flex items-center gap-1 text-red-600">
                          <CalendarX2 className="w-4 h-4" /> Vencido
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600">
                          <CalendarCheck className="w-4 h-4" /> Activo
                        </span>
                      )}
                    </p>
                  </div>

                  {sus.activado_por_usuario && (
                    <div className="text-xs text-right text-gray-400">
                      Activado por:<br />
                      <span className="font-medium text-gray-700">
                        {sus.activado_por_usuario.nombre}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

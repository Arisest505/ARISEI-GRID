import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle, AlertTriangle, FileDown, FileText } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Pago {
  id: string;
  usuario: {
    nombre: string;
    correo: string;
    codigo: string;
  };
  codigo_usuario_ingresado: string;
  monto_pagado: number;
  metodo_pago: string;
  fecha_pago: string;
  estado_pago: string;
  medio_verificado: boolean;
  recibido_por_usuario?: {
    nombre: string;
  };
}

export default function PaymentListSection() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/pagos/completados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No autorizado.");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inválida.");
      setPagos(data);
    } catch (err) {
      toast.error("Error al cargar pagos.");
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmarPago = async (pagoId: string) => {
    setConfirmandoId(pagoId);
    try {
      const res = await fetch(`http://localhost:5000/api/pagos/${pagoId}/confirmar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo confirmar.");
      toast.success("Pago confirmado");
      await fetchPagos();
    } catch (err) {
      toast.error("Error al confirmar pago");
    } finally {
      setConfirmandoId(null);
    }
  };

  const exportToExcel = () => {
    const data = pagos.map((p) => ({
      Nombre: p.usuario?.nombre || "N/A",
      Código: p.usuario?.codigo || "N/A",
      Monto: p.monto_pagado,
      Método: p.metodo_pago,
      Fecha: format(new Date(p.fecha_pago), "dd/MM/yyyy HH:mm"),
      Verificado: p.medio_verificado ? "Sí" : "No",
      RecibidoPor: p.recibido_por_usuario?.nombre || "—",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "PagosConfirmados.xlsx");
  };

const exportToPDF = () => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(16);
  doc.setTextColor(32, 100, 160); // Azul elegante
  doc.text("Reporte de Pagos Confirmados", 14, 20);

  // Espacio para la tabla
  const tableData = pagos.map((p) => [
    p.usuario?.nombre || "N/A",
    p.id, //  Código de pago en lugar del código del usuario
    `S/ ${Number(p.monto_pagado).toFixed(2)}`,
    p.metodo_pago,
    format(new Date(p.fecha_pago), "dd/MM/yyyy HH:mm"),
    p.medio_verificado ? "Sí" : "No",
    p.recibido_por_usuario?.nombre || "—",
  ]);

  autoTable(doc, {
    startY: 28,
    head: [["Nombre", "Código de Pago", "Monto", "Método", "Fecha", "Verificado", "Recibido por"]],
    body: tableData,
    headStyles: {
      fillColor: [32, 100, 160],
      textColor: 255,
      halign: "center",
    },
    styles: {
      fontSize: 10,
    },
  });

  doc.save("PagosConfirmados.pdf");
};



  return (
    <section className="max-w-6xl px-4 py-10 mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyan-800">Pagos Confirmados</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            <FileDown className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando pagos...</p>
      ) : pagos.length === 0 ? (
        <p className="text-gray-500">No hay pagos confirmados aún.</p>
      ) : (
        <div className="space-y-4">
          {pagos.map((pago) => (
            <div
              key={pago.id}
              className="p-4 transition bg-white border border-gray-200 rounded-lg shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Usuario:</strong> {pago.usuario?.nombre} ({pago.usuario?.codigo})
                  </p>
                  <p className="space-y-1 text-sm text-gray-700">
                <strong>Código de pago:</strong> {pago.id}
                </p>
                 <p className="text-sm text-gray-500">
                <strong>Monto:</strong>{" "}
                {isNaN(Number(pago.monto_pagado)) ? (
                    "Monto inválido"
                ) : (
                    <>S/ {Number(pago.monto_pagado).toFixed(2)}</>
                )}{" "}
                - {pago.metodo_pago || "Desconocido"}
                </p>

                  <p>
                    <strong>Fecha:</strong>{" "}
                    {format(new Date(pago.fecha_pago), "dd/MM/yyyy HH:mm")}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Verificado:</strong>{" "}
                    {pago.medio_verificado ? (
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <CheckCircle className="w-4 h-4" /> Sí
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 font-semibold text-yellow-600">
                          <AlertTriangle className="w-4 h-4" /> No
                        </span>
                        <button
                          onClick={() => confirmarPago(pago.id)}
                          disabled={confirmandoId === pago.id}
                          className="px-3 py-1 ml-3 text-xs font-semibold text-white rounded bg-cyan-600 hover:bg-cyan-700"
                        >
                          {confirmandoId === pago.id ? "Confirmando..." : "Confirmar"}
                        </button>
                      </>
                    )}
                  </p>
                </div>
                {pago.recibido_por_usuario?.nombre && (
                  <div className="text-xs text-right text-gray-400">
                    Recibido por:<br />
                    <span className="font-medium text-gray-700">
                      {pago.recibido_por_usuario.nombre}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

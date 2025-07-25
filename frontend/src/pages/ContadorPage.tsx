import { useState } from "react";
import ContadorDashboard from "../widgets/Suscriptions/ContadorDashboard";
import PaymentListSection from "../widgets/Suscriptions/PaymentListSection";
import HistorialSuscripciones from "../widgets/Suscriptions/HistorialSuscripciones";
import AdminPlanesView from "../widgets/Suscriptions/AdminPlanesView";

const tabs = [
  { key: "solicitudes", label: "Solicitudes Pendientes" },
  { key: "pagos", label: "Pagos Confirmados" },
  { key: "suscripciones", label: "Historial de Suscripciones" },
  { key: "planes", label: "Administrar Planes" },
];

export default function ContadorPage() {
  const [vistaActiva, setVistaActiva] = useState("solicitudes");

  const renderVista = () => {
    switch (vistaActiva) {
      case "solicitudes":
        return <ContadorDashboard />;
      case "pagos":
        return <PaymentListSection />;
      case "suscripciones":
        return <HistorialSuscripciones />;
      case "planes":
        return <AdminPlanesView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <h1 className="mb-8 text-3xl font-bold text-center text-cyan-800">Panel del Contador</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVistaActiva(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
              vistaActiva === tab.key
                ? "bg-cyan-700 text-white border-cyan-700"
                : "bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderVista()}</div>
    </div>
  );
}

import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import HelpPage from "../../pages/HelpPage"; // Asegúrate de tener esta página creada
import PlansPage from "../../pages/PlansPage"; // Asegúrate de tener esta página creada
import AuthPage from "../../pages/AuthPage";
// Asegúrate de tener esta página creada

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Puedes agregar más rutas aquí */}
    </Routes>
  );
}

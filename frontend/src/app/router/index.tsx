import { Routes, Route } from "react-router-dom";
import LayoutPublico from "../../components/LayoutPublico";
import LayoutPrivado from "../../components/LayoutPrivado";
import RequirePlanAccess from "../../components/RequirePlanAccess";

// Páginas públicas
import HomePage from "../../pages/HomePage";
import HelpPage from "../../pages/HelpPage";
import PlansPage from "../../pages/PlansPage";
import AuthPage from "../../pages/AuthPage";

// Páginas privadas
import ForoPage from "../../pages/ForoPage";
import DetallePage from "../../pages/DetallePage";
import ModulosPage from "../../pages/ModulePage";
import IncidenciaPage from "../../pages/IncidenciaPage";
import DefaultPage from "../../pages/DefaultPage";
import ContadorPage from "../../pages/ContadorPage";
import CargaMasivaPage from "../../pages/CargaMasivaPage";
import CrudPage from "../../pages/CrudPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Rutas privadas */}
      <Route element={<LayoutPrivado />}>
        <Route path="/default" element={<DefaultPage />} />

        {/* Solo accesibles si NO es rol Usuario */}
        <Route
          path="/foro"
          element={
            <RequirePlanAccess>
              <ForoPage />
            </RequirePlanAccess>
          }
        />
        <Route
          path="/modulos"
          element={
            <RequirePlanAccess>
              <ModulosPage />
            </RequirePlanAccess>
          }
        />
        <Route
          path="/incidencia"
          element={
            <RequirePlanAccess>
              <IncidenciaPage />
            </RequirePlanAccess>
          }
        />
        <Route
          path="/incidencia/:id"
          element={
            <RequirePlanAccess>
              <DetallePage />
            </RequirePlanAccess>
          }
        />

        {/* Solo accesibles si es rol Contador */}
        <Route
          path="/contador"
          element={
            <RequirePlanAccess>
              <ContadorPage />
            </RequirePlanAccess>
          }
        />
        <Route
          path="/carga-masiva"
          element={
            <RequirePlanAccess>
              <CargaMasivaPage />
            </RequirePlanAccess>
          }
        />
        <Route
          path="/crud"
          element={
            <RequirePlanAccess>
              <CrudPage />
            </RequirePlanAccess>
          }
        />
       
      </Route>
    </Routes>
  );
}

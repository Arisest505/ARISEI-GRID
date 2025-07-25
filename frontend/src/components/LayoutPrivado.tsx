// src/components/LayoutPrivado.tsx
import { Outlet } from "react-router-dom";
import NavBarForo from "../widgets/NavBarForo";
import Footer from "../widgets/Footer";

export default function LayoutPrivado() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-gray-50">
      {/* Navbar fijo arriba */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <NavBarForo />
      </header>

      {/* Contenido principal con espacio para navbar */}
      <main className="flex-1 w-full px-6 py-10 pt-20 mx-auto max-w-screen-3xl">
        <Outlet />
      </main>

      {/* Footer siempre abajo */}
      <footer className="mt-auto bg-white border-t">
        <Footer />
      </footer>
    </div>
  );
}

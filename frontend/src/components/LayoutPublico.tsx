// src/components/LayoutPublico.tsx
import NavBar from "../widgets/NavBar";
import Footer from "../widgets/Footer";
import { Outlet } from "react-router-dom";

export default function LayoutPublico() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet  />
      </main>
      <Footer />
    </>
  );
}

import { useState } from "react";
import LoginSection from "./LoginSection";
import RegisterSection from "./RegisterSection";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthContainer() {
  const [view, setView] = useState<"login" | "register">("login");

  const toggleView = () => {
    setView((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-gradient-to-br from-sky-300 via-white to-sky-700">
      {/* Círculos decorativos animados */}
      <div className="absolute w-[600px] h-[600px] bg-sky-950 opacity-80 rounded-full blur-[180px] -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[160px] -bottom-20 -right-20 animate-pulse delay-300" />

      {/* Contenido central con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="z-10 w-full max-w-md"
        >
          {view === "login" ? (
            <LoginSection onSwitch={toggleView} />
          ) : (
            <RegisterSection onSwitch={toggleView} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

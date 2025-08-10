import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, ArrowRight, Sparkles } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";

export default function DefaultPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.rol !== "Usuario") navigate("/");
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate("/auth"); };
  const handleViewPlans = () => navigate("/plans");

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen w-full overflow-hidden bg-[#F6F3EA]">
        {/* Fondo visible desde /public */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-100 -z-100 blur-sm bg-gradient-black/100"
          style={{ backgroundImage: "url('/11kjabnsjkddlñsnakljg65d6shgf.webp')" }} // <-- tu imagen en /public
        />
        {/* Overlay suave para no tapar la foto */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Trama sutil (no bloquea la imagen) */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(transparent,transparent_60%,rgba(0,0,0,0.04))]" />

        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Tarjeta glass warm */}
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative w-full max-w-xl"
          >
            {/* Glow de borde (cian + dorado suave) */}
            <motion.div
              aria-hidden
              className="absolute -inset-[1px] rounded-2xl"
              style={{
                background:
                  "linear-gradient(120deg, rgba(6,182,212,0.45), rgba(233,213,161,0.55), rgba(34,211,238,0.45))",
              }}
              animate={{ opacity: [0.35, 0.75, 0.35] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="relative rounded-2xl border border-[#E7E1D4] bg-white/60 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(17,24,39,0.15)]"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Header chip */}
              <div className="flex items-center justify-between px-6 pt-6">
                <div className="flex items-center gap-2 text-[#000000]">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[11px] tracking-widest uppercase font-bold">Usuario Básico</span>
                </div>
                <span className="rounded-full border border-[#E7E1D4] bg-white/70 px-3 py-1 text-[10px] text-[#6B7280]">
                  Acceso limitado
                </span>
              </div>

              {/* Body */}
              <div className="px-6 py-7 md:py-9">
                <h1 className="text-center text-3xl font-extrabold tracking-tight text-[#1F2937]">
                  Bienvenido, {user?.nombre || "Usuario"}
                </h1>
                <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-[#374151]">
                  Estás con rol <strong className="text-[#0EA5B7]">Usuario Básico</strong>. Activa un plan
                  para desbloquear funciones premium y una experiencia completa.
                </p>

                {/* CTAs */}
                <div className="flex flex-col gap-3 mt-8">
                  <motion.button
                    onClick={handleViewPlans}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl
                               bg-gradient-to-r from-[#11C5D5] via-[#0EA5B7] to-[#0891A2]
                               px-5 py-3 font-semibold text-white shadow-[0_12px_30px_-12px_rgba(14,165,183,0.6)]"
                  >
                    <span className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-white/15 group-hover:opacity-100" />
                    Ver Planes Disponibles
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.985 }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl
                               border border-[#E7E1D4] bg-white/70 px-5 py-3 text-sm font-medium
                               text-[#374151] hover:bg-white shadow-[0_8px_24px_-12px_rgba(17,24,39,0.08)]"
                  >
                    Cerrar sesión
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Footer badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#6B7280] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#11C5D5]" />
                  <span>Combina perfecto con el plan PRO</span>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </MotionConfig>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { UserCircle2, Copy, Menu, X, LogOut, LogIn } from "lucide-react";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Planes", href: "/plans" },
  { label: "Ayuda", href: "/help" },
];

type UserShape = { nombre: string; codigo_usuario: string } | null;

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserShape>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Leer user del localStorage 1 sola vez
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  // Respeta prefers-reduced-motion (control simple de duración)
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.documentElement.style.setProperty("--trs", media.matches ? "0ms" : "300ms");
  }, []);

  // Fondo al hacer scroll (passive)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Click fuera para UserMenu y Drawer
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showUserMenu, mobileOpen]);

  // ESC para cerrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowUserMenu(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Evitar scroll del body cuando el drawer esté abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Enfocar primer link al abrir el drawer
  useEffect(() => {
    if (mobileOpen) firstMobileLinkRef.current?.focus();
  }, [mobileOpen]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copiado al portapapeles`);
    });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    setMobileOpen(false);
    toast.success("Sesión cerrada");
    navigate("/");
  }, [navigate]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all",
        "backdrop-blur-sm",
        isScrolled ? "bg-white/90 shadow-md" : "bg-white/40"
      )}
      role="banner"
      style={{ transitionDuration: "var(--trs)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl md:px-6">
        {/* Logo + Nombre */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/LogoNegro_SOLOLOGO_IncideNETFont.svg"
            alt="Logo IncideNET"
            className="h-[34px] w-[34px] object-contain glow-icon transition-all"
            style={{ transitionDuration: "var(--trs)" }}
          />
          <span className="text-xl font-bold text-black transition-colors hover:text-cyan-600 glow-text md:text-2xl"
                style={{ transitionDuration: "var(--trs)" }}>
            IncideNET
          </span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="items-center hidden gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                clsx(
                  "group relative font-medium transition-colors",
                  isActive ? "text-cyan-600" : "text-gray-800 hover:text-cyan-600"
                )
              }
              style={{ transitionDuration: "var(--trs)" }}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={clsx(
                      "absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 transform bg-cyan-400 transition-all",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                    style={{ transitionDuration: "var(--trs)" }}
                  />
                </>
              )}
            </NavLink>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white transition bg-red-500 rounded-lg shadow-md hover:bg-red-600"
              style={{ transitionDuration: "var(--trs)" }}
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm font-semibold text-white transition rounded-lg shadow-md bg-cyan-500 hover:bg-cyan-600"
              style={{ transitionDuration: "var(--trs)" }}
            >
              Iniciar Sesión
            </button>
          )}

          {/* Usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((s) => !s)}
              className="rounded-full p-2 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-cyan-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
              aria-label="Abrir menú de usuario"
              style={{ transitionDuration: "var(--trs)" }}
            >
              <UserCircle2 className="w-6 h-6 text-black glow-icon" />
            </button>

            {/* Dropdown usuario */}
            {showUserMenu && (
              <div
                role="menu"
                className="animate-[fadeIn_.15s_ease] absolute right-0 mt-2 w-64 space-y-2 rounded-lg border border-cyan-500 bg-white p-4 shadow-lg"
              >
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        Usuario: {user.nombre}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.nombre, "Nombre")}
                        className="text-gray-500 transition hover:-translate-y-0.5 hover:scale-110 hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                        aria-label="Copiar nombre"
                        style={{ transitionDuration: "var(--trs)" }}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Código: {user.codigo_usuario}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.codigo_usuario, "Código")}
                        className="text-gray-500 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                        aria-label="Copiar código"
                        style={{ transitionDuration: "var(--trs)" }}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p>Recuerda Cerrar Sesion siempre antes de cerrar la ventana del navegador</p>
                    <p className="text-xs text-gray-600"></p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Usuario: No identificado</p>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Botón Hamburger (Mobile) */}
        <button
          className="p-2 bg-black rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          aria-controls="mobile-drawer"
          aria-expanded={mobileOpen}
          style={{ transitionDuration: "var(--trs)" }}
        >
          <Menu className="w-6 h-6 glow-icon" />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ transitionDuration: "var(--trs)" }}
      />

      {/* Drawer */}
      <aside
        id="mobile-drawer"
        ref={mobileRef}
        className={clsx(
          "fixed right-0 top-0 z-50 h-full w-[85%] max-w-xs bg-white shadow-2xl transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          transitionDuration: "var(--trs)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <img
              src="/LogoNegro_SOLOLOGO_IncideNETFont.svg"
              alt="Logo IncideNET"
              className="h-7 w-7 glow-icon"
            />
            <span className="glow-text text-lg font-bold text-black transition-colors duration-[var(--trs)] hover:text-cyan-600 md:text-2xl">
              IncideNET
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md focus:outline-none bg-cyan-600 focus:ring-2 focus:ring-cyan-500/60"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6 glow-icon" />
          </button>
        </div>

        {/* Usuario (resumen) */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-8 h-8 text-gray-700 glow-icon" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user ? user.nombre : "No identificado"}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user ? `Código: ${user.codigo_usuario}` : "Inicia sesión para más opciones"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-semibold text-white transition bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                style={{ transitionDuration: "var(--trs)" }}
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-semibold text-white transition rounded-md bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                style={{ transitionDuration: "var(--trs)" }}
              >
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Links */}
        <nav className="px-2 py-2 bg-white" aria-label="Menú móvil">
          {NAV_LINKS.map((link, idx) => (
            <NavLink
              key={link.href}
              to={link.href}
              ref={idx === 0 ? firstMobileLinkRef : undefined}
              className={({ isActive }) =>
                clsx(
                  "block rounded-md px-3 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/60",
                  isActive ? "bg-cyan-50 text-cyan-700" : "text-gray-800 hover:bg-cyan-50 hover:text-cyan-700"
                )
              }
              style={{ transitionDuration: "var(--trs)" }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </header>
  );
}

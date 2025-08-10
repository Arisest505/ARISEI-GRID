import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";
import { UserCircle2, Copy, Check, Menu, X, LogOut } from "lucide-react";
import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

type CopyField = "nombre" | "codigo";

interface PermisoModulo {
  path: string;
  icono?: string;
  modulo: string;
}

type IconName = keyof typeof Lucide;

export default function NavBarForo() {
  const { user, logout, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copiedField, setCopiedField] = useState<CopyField | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirección si no hay sesión
  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  // Respeta prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.documentElement.style.setProperty("--trs", media.matches ? "0ms" : "300ms");
  }, []);

  // Efecto de scroll (passive)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setShowUserMenu(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Click fuera (dropdown + drawer)
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

  const copyToClipboard = useCallback(async (text: string, field: CopyField) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedField(field);
      toast.success(`${field === "nombre" ? "Nombre" : "Código"} copiado`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("No se pudo copiar al portapapeles");
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setShowUserMenu(false);
    setMobileOpen(false);
    toast.success("Sesión cerrada correctamente");
    navigate("/", { replace: true });
  }, [logout, navigate]);

  // Render de ícono dinámico
  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    if (!(iconName in Lucide)) return null;
    const Icon = Lucide[iconName as IconName] as LucideIcon | undefined;
    return Icon ? <Icon className="w-4 h-4 text-cyan-500 glow-icon" /> : null;
  };

  // Permisos únicos por path
  const permisos: PermisoModulo[] = (user?.permisos ?? []) as PermisoModulo[];
  const modulosUnicos: PermisoModulo[] = Array.from(
    new Map<string, PermisoModulo>(permisos.map((p) => [p.path, p])).values()
  );

  const codigoUsuario = user?.codigo_usuario ?? "";
  const codigoUsuarioPreview = codigoUsuario ? `${codigoUsuario.slice(0, 20)}...` : "—";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all backdrop-blur-sm",
        isScrolled ? "bg-white/90 shadow-md" : "bg-white/40"
      )}
      role="banner"
      style={{ transitionDuration: "var(--trs)" }}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo + Nombre */}
        <Link to="/" className="flex items-center justify-center gap-2">
          <img
            src="/LogoNegro_SOLOLOGO_IncideNETFont.svg"
            alt="Logo IncideNET"
            className="w-[34px] h-[auto] object-contain glow-icon transition-all duration-[var(--trs)] ease-in-out"
          />
          <h1 className="text-2xl font-bold text-black hover:text-cyan-600 glow-text transition-colors duration-[var(--trs)] ease-in-out">
            IncideNET
          </h1>
        </Link>

        {/* Navegación Desktop */}
        <nav className="items-center hidden space-x-6 text-gray-800 md:flex" aria-label="Foro">
          {loading ? (
            <span className="text-sm text-gray-500">Cargando módulos...</span>
          ) : (
            modulosUnicos.map((modulo) => (
              <NavLink
                key={modulo.path}
                to={modulo.path}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center gap-1 font-medium transition-colors",
                    isActive ? "text-cyan-600" : "text-gray-800 hover:text-cyan-600"
                  )
                }
                style={{ transitionDuration: "var(--trs)" }}
              >
                {({ isActive }) => (
                  <>
                    {renderIcon(modulo.icono)}
                    {modulo.modulo}
                    <span
                      className={clsx(
                        "absolute left-1/2 -bottom-1 h-[2px] -translate-x-1/2 transform bg-cyan-400 transition-all",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                      style={{ transitionDuration: "var(--trs)" }}
                    />
                  </>
                )}
              </NavLink>
            ))
          )}

          {/* Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-white transition bg-red-500 rounded-lg shadow hover:bg-red-600"
            style={{ transitionDuration: "var(--trs)" }}
          >
            Cerrar sesión
          </button>

          {/* Menú usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="p-2 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-cyan-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500/60 rounded-full"
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
              aria-label="Abrir menú de usuario"
              style={{ transitionDuration: "var(--trs)" }}
            >
              <UserCircle2 className="w-6 h-6 text-black glow-icon" />
            </button>

            {showUserMenu && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 space-y-3 rounded-lg border border-cyan-500 bg-white p-4 shadow-xl animate-[fadeIn_.15s_ease]"
              >
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Usuario:</span>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        {user.nombre}
                        <button
                          onClick={() => copyToClipboard(user.nombre, "nombre")}
                          className="ml-1 text-gray-500 transition hover:-translate-y-0.5 hover:scale-105 hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/60 rounded"
                          aria-label="Copiar nombre"
                          title="Copiar nombre"
                        >
                          {copiedField === "nombre" ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Código:</span>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span title={codigoUsuario}>{codigoUsuarioPreview}</span>
                        <button
                          onClick={() => copyToClipboard(codigoUsuario, "codigo")}
                          className="ml-1 text-gray-500 transition rounded hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                          aria-label="Copiar código"
                          title="Copiar código"
                        >
                          {copiedField === "codigo" ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">No identificado</p>
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
          aria-controls="foro-mobile-drawer"
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

      {/* Drawer Móvil */}
      <aside
        id="foro-mobile-drawer"
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
        aria-label="Menú del foro"
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
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/60 bg-cyan-600"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6 glow-icon " />
          </button>
        </div>

        {/* Usuario (resumen) */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-8 h-8 text-gray-700 glow-icon" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nombre ?? "No identificado"}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user ? `Código: ${user.codigo_usuario}` : "Inicia sesión para más opciones"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-semibold text-white transition bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              style={{ transitionDuration: "var(--trs)" }}
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        </div>

        {/* Módulos (links) */}
        <nav className="px-2 py-2 bg-white" aria-label="Módulos del foro">
          {loading ? (
            <span className="block px-3 py-3 text-sm text-gray-500">Cargando módulos...</span>
          ) : (
            modulosUnicos.map((m, idx) => (
              <NavLink
                key={m.path}
                to={m.path}
                ref={idx === 0 ? firstMobileLinkRef : undefined}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/60",
                    isActive ? "bg-cyan-50 text-cyan-700" : "text-gray-800 hover:bg-cyan-50 hover:text-cyan-700"
                  )
                }
                style={{ transitionDuration: "var(--trs)" }}
              >
                {renderIcon(m.icono)}
                {m.modulo}
              </NavLink>
            ))
          )}
        </nav>

        {/* Datos rápidos (nombre/código con copiar) */}
        <div className="px-4 py-3 mt-auto text-sm text-gray-700 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="font-medium">Usuario</span>
            <div className="flex items-center gap-1">
              <span className="truncate max-w-[140px]">{user?.nombre ?? "—"}</span>
              <button
                onClick={() => user?.nombre && copyToClipboard(user.nombre, "nombre")}
                className="p-1 text-gray-500 transition rounded hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                aria-label="Copiar nombre"
                title="Copiar nombre"
              >
                {copiedField === "nombre" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="font-medium">Código</span>
            <div className="flex items-center gap-1">
              <span className="truncate max-w-[140px]" title={codigoUsuario}>{codigoUsuarioPreview}</span>
              <button
                onClick={() => codigoUsuario && copyToClipboard(codigoUsuario, "codigo")}
                className="p-1 text-gray-500 transition rounded hover:text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                aria-label="Copiar código"
                title="Copiar código"
              >
                {copiedField === "codigo" ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}

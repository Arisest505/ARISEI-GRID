import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";
import { UserCircle2, Copy, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

export default function NavBarForo() {
  const { user, logout, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copiedField, setCopiedField] = useState<"nombre" | "codigo" | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!loading && !user) return null;

  const copyToClipboard = (text: string, field: "nombre" | "codigo") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast.success(`${field === "nombre" ? "Nombre" : "Código"} copiado`);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };


const handleLogout = () => {
  logout(); // ← Limpia el estado del usuario
  toast.success("Sesión cerrada correctamente");
  navigate("/", { replace: true }); // Redirige sin refrescar la página
};

useEffect(() => {
  if (!loading && !user) {
    navigate("/auth", { replace: true });
  }
}, [user, loading, navigate]);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-4 h-4 text-cyan-500" /> : null;
  };

  const modulosUnicos = Array.from(
    new Map((user?.permisos ?? []).map((p) => [p.path, p])).values()
  );

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        "backdrop-blur-md",
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
      <div className="flex items-center gap-2">
                <img
                  src="/LogoNegroIncideNETFont.svg"
                  alt="Logo ARISEI"
                  className="w-[100px] h-[auto] object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.7)] transition-all duration-300 ease-in-out"
                />
            </div>

        {/* Navegación */}
        <nav className="items-center hidden space-x-6 text-gray-800 md:flex">
          {loading ? (
            <span className="text-sm text-gray-500">Cargando módulos...</span>
          ) : (
            modulosUnicos.map((modulo) => (
              <Link
                key={modulo.path}
                to={modulo.path}
                className={clsx(
                  "relative flex items-center gap-1 font-medium group",
                  location.pathname === modulo.path && "text-cyan-600"
                )}
              >
                {renderIcon(modulo.icono)}
                {modulo.modulo}
                <span className="absolute left-1/2 bottom-[-4px] w-0 h-[2px] bg-cyan-400 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full" />
              </Link>
            ))
          )}

          {/* Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-white transition bg-red-500 rounded-lg shadow hover:bg-white hover:text-red-500 hover:shadow-md"
          >
            Cerrar sesión
          </button>

          {/* Menú usuario */}
          <div className="relative ml-4" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 transition rounded-full hover:bg-cyan-100 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 hover:shadow-cyan-300 duration-300 ease-in-out"
            >
              <UserCircle2 className="w-6 h-6 text-black" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 z-50 p-4 mt-2 space-y-3 bg-white border rounded-lg shadow-xl w-72 animate-fade-in">
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Usuario:</span>
                      <div className="flex items-center gap-1 text-sm text-gray-700 hover:cursor-pointer">
                        {user.nombre}
                        <button
                          onClick={() => copyToClipboard(user.nombre, "nombre")}
                          className="ml-1 text-gray-500 hover:text-black hover:cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:scale-105 hover:shadow-cyan-300 duration-300 ease-in-out animate-fade-in animate-fade-in "
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
                        <span title={user.codigo_usuario}>
                          {user.codigo_usuario.slice(0, 20)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(user.codigo_usuario, "codigo")}
                          className="ml-1 text-gray-500 hover:text-black"
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
      </div>
    </header>
  );
}

import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { UserCircle2, Copy } from "lucide-react";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Planes", href: "/plans" },
  { label: "Ayuda", href: "/help" },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<{ nombre: string; codigo_usuario: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copiado al portapapeles`);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        "backdrop-blur-md",
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo + Nombre */}
        <div className="flex items-center space-x-3">
          <img src="/logo.webp" alt="Logo ARISEI" className="w-[52px] h-[52px] object-contain" />
          <span className="text-2xl font-bold tracking-tight text-cyan-600">ARISEI</span>
        </div>

        {/* Navegación */}
        <nav className="items-center hidden space-x-8 text-gray-800 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="relative font-medium group">
              {link.label}
              <span className="absolute left-1/2 bottom-[-4px] w-0 h-[2px] bg-cyan-600 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full" />
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white transition bg-red-500 rounded-lg shadow-md hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-sm font-semibold text-white transition rounded-lg shadow-md bg-cyan-600 hover:bg-cyan-700"
            >
              Ingresar
            </button>
          )}

          {/* Usuario */}
          <div className="relative ml-4" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 transition rounded-full hover:bg-gray-200"
            >
              <UserCircle2 className="w-6 h-6 text-cyan-700" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 z-50 w-64 p-4 mt-2 space-y-2 bg-white border rounded-lg shadow-lg animate-fade-in">
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        Usuario: {user.nombre}
                      </span>
                      <button
                        onClick={() => copyToClipboard(user.nombre, "Nombre")}
                        className="text-gray-500 hover:text-cyan-600"
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
                        className="text-gray-500 hover:text-cyan-600"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Usuario: No identificado</p>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

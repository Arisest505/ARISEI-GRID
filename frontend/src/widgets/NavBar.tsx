import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { UserCircle2 } from "lucide-react";

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
          <img
            src="/logo.webp"
            alt="Logo ARISEI"
            className="w-[52px] h-[52px] object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-cyan-600">ARISEI</span>
        </div>

        {/* Navegación */}
        <nav className="hidden space-x-8 text-gray-800 md:flex items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative font-medium group"
            >
              {link.label}
              <span className="absolute left-1/2 bottom-[-4px] w-0 h-[2px] bg-cyan-600 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full" />
            </Link>
          ))}

          {/* Botón de Login */}
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition"
          >
            Ingresar
          </button>

          {/* Icono de usuario */}
          <div className="relative ml-4" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <UserCircle2 className="w-6 h-6 text-cyan-700" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border z-50 animate-fade-in">
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-800">Usuario: Juan Pérez</p>
                  <p className="text-xs text-gray-600">ID: 203384S1</p>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
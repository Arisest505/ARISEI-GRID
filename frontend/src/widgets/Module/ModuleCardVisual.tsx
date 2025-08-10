import * as LucideIcons from "lucide-react";
import clsx from "clsx";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Se crea un tipo que representa un componente de Lucide
type LucideIconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// Se filtra el objeto LucideIcons para obtener solo los componentes de iconos
const validIcons = Object.fromEntries(
  Object.entries(LucideIcons).filter(([, value]) => typeof value === 'object')
) as Record<string, LucideIconComponent>;

interface Props {
  nombre: string;
  icono?: string;
  path: string;
  activo: boolean;
  onToggle?: () => void;
}

export default function ModuleCardVisual({
  nombre,
  icono,
  activo,
  onToggle,
}: Props) {
  // Ahora la lógica de selección es segura
  const IconComponent =
    (icono && validIcons[icono as keyof typeof validIcons]) ||
    validIcons.LayoutGrid;

  return (
    <div
      onClick={onToggle}
      className={clsx(
        "relative flex items-center justify-between w-full px-4 py-2 rounded-full cursor-pointer border shadow-sm hover:shadow-md hover:scale-[1.02] transition-transform duration-300",
        activo
          ? "bg-green-50 border-green-400 text-green-800"
          : "bg-red-50 border-red-300 text-red-700"
      )}
    >
      <div className="flex items-center gap-2 truncate">
        {/* Ahora IconComponent es un componente de React válido garantizado */}
        <IconComponent className="w-4 h-4 shrink-0" />
        <span className="font-medium truncate">{nombre}</span>
      </div>
      <span
        className={clsx(
          "text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wide transition-all",
          activo
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        )}
      >
        {activo ? "PERMITIDO" : "DENEGADO"}
      </span>
    </div>
  );
}
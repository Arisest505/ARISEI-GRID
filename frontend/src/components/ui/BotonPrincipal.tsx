// BotonPrincipal.tsx
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "ghost" | "outline" | "flat";
  active?: boolean;
}

export const Boton = ({
  children,
  variant = "primary",
  className,
  active = false,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97]";

  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-md focus:ring-cyan-400",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-400",
    ghost: "bg-white/10 text-black border border-black/10 hover:bg-white/20 backdrop-blur-md focus:ring-gray-300",
    outline: "bg-transparent text-cyan-600 border border-cyan-600 hover:bg-cyan-100 focus:ring-cyan-400",
    flat: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400",
  };

  const activeStyle =
    "ring-2 ring-offset-2 ring-cyan-400 border border-cyan-600 text-cyan-800 bg-white shadow-inner";

  return (
    <button
      {...props}
      className={clsx(
        baseStyles,
        variants[variant],
        active && variant === "ghost" && activeStyle,
        className
      )}
    >
      {children}
    </button>
  );
};

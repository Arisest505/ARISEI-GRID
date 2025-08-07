// components/ui/Input.tsx
import React from "react";
import clsx from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: Props) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={clsx(
          "w-full px-4 py-2 rounded-xl border bg-white/10 text-black/80 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500",
          "transition-all duration-200 ease-in-out backdrop-blur-md",
          error
            ? "border-red-400 ring-1 ring-red-300 placeholder:text-red-300 text-red-500"
            : "border-neutral-300 hover:border-cyan-300",
          className
        )}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

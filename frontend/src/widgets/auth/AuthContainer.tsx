// src/widgets/auth/AuthContainer.tsx
import { useState } from "react";
import LoginSection from "./LoginSection";
import RegisterSection from "./RegisterSection";

export default function AuthContainer() {
  const [view, setView] = useState<"login" | "register">("login");

  const toggleView = () => {
    setView((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200 px-4">
      {view === "login" ? (
        <LoginSection onSwitch={toggleView} />
      ) : (
        <RegisterSection onSwitch={toggleView} />
      )}
    </div>
  );
}

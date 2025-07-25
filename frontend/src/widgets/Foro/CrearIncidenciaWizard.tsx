// src/widgets/Foro/CrearIncidenciaWizard.tsx
import { useState } from "react";

// Componentes por paso
import PersonaIncidenciaForm from "./CrearIncidencia/Pasos/PersonaIncidenciaForm";
import InstitucionForm from "./CrearIncidencia/Pasos/InstitucionForm";
import DatosIncidenciaForm from "./CrearIncidencia/Pasos/DatosIncidenciaForm";
import FamiliaresForm from "./CrearIncidencia/Pasos/FamiliaresForm";
import ResumenFinal from "./CrearIncidencia/Pasos/ResumenFinal";

// Tipos
import type {
  PersonaData,
  InstitucionData,
  IncidenciaData,
  FamiliarVinculoData,
} from "@/types/FormData";

// Suponemos que tienes algo como esto para obtener el usuario:
import { useAuth } from "../../hooks/useAuth";

const initialPersona: PersonaData = {
  nombre_completo: "",
  dni: "",
  fecha_nacimiento: "",
  genero: "",
  telefono: "",
  correo: "",
  imagen_url: "",
  notas_adicionales: "",
};

const initialInstitucion: InstitucionData = {
  nombre: "",
  tipo: "",
  ubicacion: "",
  codigo_modular: "",
};

const initialIncidencia: IncidenciaData = {
  titulo: "",
  descripcion: "",
  tipo_incidencia: "",
  monto_deuda: "",
  fecha_incidencia: "",
  estado_incidencia: "Pendiente",
  confidencialidad_nivel: "Privado",
  adjuntos_url: "",
};

export default function CrearIncidenciaWizard() {
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState<PersonaData>(initialPersona);
  const [institucion, setInstitucion] = useState<InstitucionData>(initialInstitucion);
  const [incidencia, setIncidencia] = useState<IncidenciaData>(initialIncidencia);
  const [familiares, setFamiliares] = useState<FamiliarVinculoData[]>([]);
  const [loading, setLoading] = useState(false);
  
const { user } = useAuth();
console.log("🔐 Usuario desde contexto:", user); //  Asegúrate de tener esto implementado

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));
  
console.log("📤 Enviando datos a la API:", {
  persona,
  institucion,
  incidencia,
  familiares,
  usuario_id: user?.id,
});

  const handlePublicar = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/incidencias/crear", { // usa el puerto donde corre tu backend
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    persona,
    institucion,
    incidencia,
    familiares,
    usuario_id: user?.id,
  }),
});


      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error inesperado");

      alert(" Incidencia publicada correctamente");
      // Aquí podrías redirigir o reiniciar estados
    } catch (err) {
      console.error(err);
      alert(" Error al publicar la incidencia");
    } finally {
      setLoading(false);
    }
  };

  return (
   <section className="py-16 bg-gray-200" id="ask"> 
     <div className="max-w-6xl px-6 py-8 mx-auto ">
      <h2 className="mb-6 text-3xl font-bold text-center text-cyan-700">
        Crear nueva incidencia
      </h2>

      <div className="p-6 transition-all duration-300 ease-in-out bg-white shadow-md rounded-xl">
        {step === 1 && (
          <PersonaIncidenciaForm
            initialData={persona}
            onNext={(data) => {
              setPersona(data);
              next();
            }}
          />
        )}

        {step === 2 && (
          <InstitucionForm
            initialData={institucion}
            onBack={back}
            onNext={(data) => {
              setInstitucion(data);
              next();
            }}
          />
        )}

        {step === 3 && (
          <DatosIncidenciaForm
            data={incidencia}
            onBack={back}
            onNext={(data) => {
              setIncidencia(data);
              next();
            }}
          />
        )}

        {step === 4 && (
          <FamiliaresForm
            data={familiares}
            onBack={back}
            onNext={(data) => {
              setFamiliares(data);
              next();
            }}
          />
        )}

        {step === 5 && (
          <ResumenFinal
            persona={persona}
            institucion={institucion}
            incidencia={incidencia}
            familiares={familiares}
            onBack={back}
            onPublicar={handlePublicar}
            loading={loading}
          />
        )}
      </div>
    </div>
    </section>
  );
}

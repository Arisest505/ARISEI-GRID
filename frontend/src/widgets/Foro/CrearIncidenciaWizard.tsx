import { useState } from "react";
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

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));
  


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

    } catch (err) {
      console.error(err);
      alert(" Error al publicar la incidencia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen py-20 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/01sdasgtkyukjgh.jpg')",
      }}
      id="crear-incidencia"
    >
      {/* Capa negra suave para contraste */}
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-6xl px-6 mx-auto">
        <h2 className="mb-10 text-4xl font-extrabold text-center text-white drop-shadow-lg">
          Crear nueva incidencia
        </h2>

        <div className="p-6 transition-all duration-500 bg-white border shadow-2xl rounded-xl border-slate-200 animate-fade-in">
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

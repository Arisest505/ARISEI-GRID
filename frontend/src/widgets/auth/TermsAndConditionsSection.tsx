// TermsAndConditionsSection.tsx
import { useEffect } from "react";

interface Props {
  onClose: () => void;
}

export default function TermsAndConditionsSection({ onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl p-6 bg-white shadow-2xl rounded-xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute text-2xl text-red-600 transition-all duration-300 top-3 right-3 hover:text-red-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          X
        </button>
        <h2 className="mb-4 text-2xl font-bold text-cyan-700">
          📜 Términos y Condiciones Generales
        </h2>
        <div className="space-y-6 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-2">

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">1. Aceptación del Usuario</h3>
            <p>
              El ingreso, registro y uso de esta plataforma implica la aceptación total de los presentes Términos y Condiciones. Está dirigida exclusivamente a personas que representen formalmente a instituciones educativas o administrativas (docentes, directivos, personal autorizado). El usuario asume plena responsabilidad sobre el uso y gestión de su cuenta.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">2. Uso Correcto y Responsable</h3>
            <p>
              El usuario se compromete a hacer uso de la plataforma única y exclusivamente para fines legítimos, profesionales y relacionados con su institución. Se prohíbe expresamente:
            </p>
            <ul className="ml-4 list-disc list-inside">
              <li>Incitar, compartir o divulgar contenidos que promuevan el odio, racismo, violencia o discriminación.</li>
              <li>Amenazar o acosar a otros usuarios.</li>
              <li>Publicar o enviar información falsa, ilegal o sin autorización.</li>
              <li>Suplantar identidades o falsificar información institucional.</li>
              <li>Utilizar la plataforma para fines no permitidos o fuera de su objetivo educativo o administrativo.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">3. Verificación y Validación Institucional</h3>
            <p>
              Los datos registrados están sujetos a verificación por nuestro equipo. Se podrá:
            </p>
            <ul className="ml-4 list-disc list-inside">
              <li>Validar identidad del usuario con datos institucionales.</li>
              <li>Solicitar documentación adicional.</li>
              <li>Verificar antecedentes y reputación digital mediante fuentes públicas o privadas (ej. Infocorp en Perú).</li>
              <li>Deshabilitar temporalmente funcionalidades si se detectan inconsistencias.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">4. Derechos del Administrador</h3>
            <p>
              El administrador o equipo gestor de la plataforma se reserva el derecho de:
            </p>
            <ul className="ml-4 list-disc list-inside">
              <li>Suspender, eliminar o editar cualquier cuenta o contenido sin previo aviso si se infringen los presentes términos o se incurre en faltas graves.</li>
              <li>Bloquear de manera preventiva a usuarios sospechosos de manipulación, mal uso, fraudes u otros comportamientos que pongan en riesgo la integridad del sistema o sus usuarios.</li>
              <li>Limitar temporalmente funciones para mantener la seguridad y operación del sistema.</li>
              <li>Emitir notificaciones automáticas (recordatorios, alertas, vencimientos de servicios, etc.).</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">5. Servicios, Planes y Política de Pagos</h3>
            <p>
              Los planes ofrecidos en la plataforma son servicios digitales de activación institucional. Al adquirir uno de estos planes, el usuario:
            </p>
            <ul className="ml-4 list-disc list-inside">
              <li>Reconoce que está contratando un servicio no tangible.</li>
              <li>Acepta que no se realizarán reembolsos, salvo error técnico verificado por el equipo.</li>
              <li>Entiende que el uso indebido o el incumplimiento de los términos puede causar la desactivación inmediata sin derecho a compensación.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">6. Comunicaciones Oficiales</h3>
            <p>
              Toda comunicación será enviada al correo institucional registrado por el usuario. Es responsabilidad del usuario mantener actualizada esta información.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">7. Modificaciones de los Términos</h3>
            <p>
              Estos Términos y Condiciones pueden ser actualizados o modificados en cualquier momento. Las nuevas condiciones serán notificadas en la plataforma o vía email. El uso continuado del sistema implica su aceptación.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">8. Responsabilidad Legal del Usuario</h3>
            <p>
              El usuario acepta ser responsable de toda acción ejecutada bajo su cuenta. El sistema registra actividad, interacciones y cambios para fines de auditoría.
            </p>
            <p>
              Cualquier intento de dañar, vulnerar o desprestigiar el sistema podrá ser denunciado ante las autoridades pertinentes. Los administradores quedan exentos de toda responsabilidad ante terceros por actos cometidos por los usuarios dentro de la plataforma.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">9. Exclusión de Responsabilidad</h3>
            <p>
              Esta plataforma no se hace responsable por:
            </p>
            <ul className="ml-4 list-disc list-inside">
              <li>Fallos del sistema por causas ajenas (corte eléctrico, caída de servidores, etc.).</li>
              <li>Daños o perjuicios causados por terceros utilizando datos sin autorización.</li>
              <li>Decisiones tomadas por instituciones basadas en información cargada por los usuarios.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-center text-gray-700">
               Al continuar utilizando esta plataforma, declaras haber leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones, eximiendo al equipo desarrollador de cualquier mal uso o interpretación indebida.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

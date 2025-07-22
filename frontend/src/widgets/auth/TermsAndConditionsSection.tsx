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
      <div className="bg-white p-6 rounded-xl max-w-3xl w-full shadow-2xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-cyan-700">
          📜 Términos y Condiciones Generales
        </h2>
        <div className="space-y-6 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-2">

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">1. Aceptación del Usuario</h3>
            <p>
              Al registrarte en nuestra plataforma, confirmas haber leído y aceptado estos Términos y Condiciones. Esta plataforma está dirigida exclusivamente a representantes institucionales: docentes, directores y personal administrativo autorizado.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">2. Uso Responsable</h3>
            <p>
              El usuario se compromete a utilizar la plataforma exclusivamente para fines institucionales. Queda estrictamente prohibido:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Incitar al odio, violencia, racismo o discriminación de cualquier tipo.</li>
              <li>Realizar amenazas contra otros usuarios o instituciones.</li>
              <li>Difundir contenido ilegal, ofensivo o falso.</li>
              <li>Suplantar identidad o manipular información institucional.</li>
              <li>Promover prácticas ilegales o actividades fraudulentas.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">3. Validación y Supervisión</h3>
            <p>
              Todos los datos proporcionados por el usuario están sujetos a verificación. Nos reservamos el derecho de realizar validaciones institucionales y de identidad, incluyendo el historial crediticio del usuario mediante entidades autorizadas como <strong>Infocorp</strong>.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">4. Derechos del Administrador</h3>
            <p>
              Los administradores y creadores de esta plataforma se reservan el derecho de:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Suspender o eliminar cuentas sin previo aviso si se infringen estos términos.</li>
              <li>Bloquear cuentas ante indicios de uso indebido, contenido ofensivo o actividad sospechosa.</li>
              <li>Enviar notificaciones automáticas relacionadas a pagos, alertas o recordatorios de gestión institucional.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">5. Pagos y Servicios</h3>
            <p>
              Los servicios ofrecidos, como el plan PRO, son de pago. La activación se realiza bajo validación institucional. <strong>No se realizan reembolsos</strong> si se detecta incumplimiento de estos términos o uso indebido.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">6. Comunicación y Soporte</h3>
            <p>
              Las comunicaciones oficiales se realizarán al correo electrónico registrado por el usuario. Recomendamos mantenerlo actualizado y revisar regularmente su bandeja de entrada.
              Ante dudas, quejas o reportes institucionales, se puede contactar a nuestro equipo mediante la sección de contacto.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyan-600">7. Responsabilidad Legal</h3>
            <p>
              Esta plataforma cumple con las leyes de protección de datos y ética digital. Toda acción legal en nuestra contra que derive de un mal uso por parte del usuario podrá ser contrademandada. Al aceptar, el usuario declara ser responsable de su actividad dentro de la plataforma y exime a los creadores de responsabilidades ante terceros.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700 text-center">
               Al aceptar estos términos, confirmas que has leído, comprendido y aceptado todas las condiciones establecidas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
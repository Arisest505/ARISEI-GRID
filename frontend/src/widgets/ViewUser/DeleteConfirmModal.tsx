import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  mensaje = "¿Estás seguro de que deseas eliminar esta incidencia?",
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-sm p-6 text-center bg-white shadow-lg rounded-xl"
          >
            {/* Botón de Cerrar */}
            <button
              className="absolute text-gray-400 top-3 right-3 hover:text-red-500"
              onClick={onClose}
              aria-label="Cerrar confirmación"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icono de eliminación */}
            <Trash2 className="w-10 h-10 mx-auto mb-4 text-red-600" />
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              Confirmar Eliminación
            </h2>
            <p className="mb-6 text-sm text-gray-600">{mensaje}</p>

            {/* Botones de acción */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 transition border border-gray-300 rounded-md hover:bg-gray-100"
                aria-label="Cancelar eliminación"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();  // Ejecuta la confirmación
                  onClose();    // Cierra el modal después de la confirmación
                }}
                className="px-4 py-2 text-white transition bg-red-600 rounded-md hover:bg-red-700"
                aria-label="Confirmar eliminación"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

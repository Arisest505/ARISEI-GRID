import { useEffect, useState, useCallback } from "react";
import ViewUserHero from "../widgets/ViewUser/ViewUserHero";
import UserIncidenciasList from "../widgets/ViewUser/UserIncidenciasList";
import EditIncidenciaModal from "../widgets/ViewUser/EditIncidenciaModal";
import DeleteConfirmModal from "../widgets/ViewUser/DeleteConfirmModal";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import type { Incidencia } from "../types/Incidencia"; // solo se mantiene esta línea
// + añade esta línea
import { apiFetch } from "../lib/api";

export default function ViewUserPage() {
  const { user } = useAuth();
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);


 const fetchIncidencias = useCallback(async () => {
  if (!user?.id) return;
  setLoading(true);
  try {
    const res = await apiFetch(`/usuario/${user.id}/incidencias`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Error al obtener incidencias");
    setIncidencias(data);
  } catch (error: any) {
    toast.error(error?.message || "Error al cargar incidencias.");
  } finally {
    setLoading(false);
  }
}, [user?.id]);


  useEffect(() => {
    fetchIncidencias();
  }, [fetchIncidencias]);

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setConfirmModalOpen(true);
  };

 const confirmDelete = async () => {
  if (!idToDelete) return;
  try {
    const res = await apiFetch(`/incidencias/${idToDelete}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Error al eliminar");
    toast.success("Incidencia eliminada correctamente.");
    setIncidencias((prev) => prev.filter((i) => i.id !== idToDelete));
  } catch (error: any) {
    toast.error(error?.message || "Error al eliminar incidencia.");
  } finally {
    setIdToDelete(null);
    setConfirmModalOpen(false);
  }
};


  return (
    <>
      <ViewUserHero />
      <div className="max-w-5xl px-4 py-8 mx-auto">
        <UserIncidenciasList
          incidencias={incidencias}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {selectedId && (
        <EditIncidenciaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          incidenciaId={selectedId}
          onUpdate={fetchIncidencias}
        />
      )}

      <DeleteConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        mensaje="¿Deseas eliminar esta incidencia? Esta acción es irreversible."
      />
    </>
  );
}

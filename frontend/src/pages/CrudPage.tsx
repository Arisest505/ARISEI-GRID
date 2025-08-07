import CrudsAdminPage from "../widgets/CRUD/CrudsAdminPage";
import HeroCrud from "../widgets/CRUD/HeroCrud";

export default function CrudPage() {
  return (
    <>
      <HeroCrud />

      <main>
      <CrudsAdminPage />
      </main>

    </>
  );
}

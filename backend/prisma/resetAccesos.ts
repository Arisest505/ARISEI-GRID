// prisma/resetDatabase.ts
import { prisma } from "../src/lib/prisma";

async function resetDatabase() {
  console.log("🧨 Iniciando borrado total de datos...");

  try {
    // 🔄 Relaciones más profundas primero
    await prisma.vinculoFamiliarPersona.deleteMany();
    await prisma.familiar.deleteMany();
    await prisma.incidencia.deleteMany();
    await prisma.personaIncidencia.deleteMany();
    await prisma.institucion.deleteMany();

    await prisma.suscripcionUsuario.deleteMany();
    await prisma.pago.deleteMany();

    await prisma.rolModuloAcceso.deleteMany();
    await prisma.permisoModulo.deleteMany();
    await prisma.modulo.deleteMany();

    await prisma.usuario.deleteMany();
    await prisma.rol.deleteMany();
    await prisma.plan.deleteMany();

    console.log("✅ Todos los datos han sido eliminados exitosamente.");
  } catch (error) {
    console.error("❌ Error durante el reseteo:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();

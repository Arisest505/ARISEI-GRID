import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Roles
  const roles = [
    { id: "1", nombre: "Administrador" },
    { id: "2", nombre: "Usuario" },
  ];

  for (const rol of roles) {
    await prisma.rol.upsert({
      where: { id: rol.id },
      update: {},
      create: { ...rol },
    });
  }

  // 2. Módulos con permisos
  const modulos = [
    {
      id: "1",
      nombre: "Foro",
      path: "/foro",
      icono: "message-circle",
      orden_menu: 1,
      permisos: ["ver", "crear", "editar", "eliminar"],
    },
    {
      id: "2",
      nombre: "Planes",
      path: "/plans",
      icono: "dollar-sign",
      orden_menu: 2,
      permisos: ["ver"],
    },
    {
      id: "3",
      nombre: "Ayuda",
      path: "/help",
      icono: "help-circle",
      orden_menu: 3,
      permisos: ["ver", "crear"],
    },
    {
      id: "4",
      nombre: "Contactos",
      path: "/contacts",
      icono: "phone",
      orden_menu: 4,
      permisos: ["ver"],
    },
  ];

  for (const mod of modulos) {
    await prisma.modulo.upsert({
      where: { id: mod.id },
      update: {},
      create: {
        id: mod.id,
        nombre: mod.nombre,
        path: mod.path,
        icono: mod.icono,
        orden_menu: mod.orden_menu,
        permisos: {
          create: mod.permisos.map((nombre) => ({ nombre })),
        },
      },
    });
  }

  // 3. Asignar accesos
  const allRoles = await prisma.rol.findMany();
  const allPermisos = await prisma.permisoModulo.findMany();

  for (const rol of allRoles) {
    for (const permiso of allPermisos) {
      let acceso_otorgado = false;

      if (rol.nombre === "Administrador") acceso_otorgado = true;
      if (rol.nombre === "Usuario" && ["ver", "crear"].includes(permiso.nombre))
        acceso_otorgado = true;

      await prisma.rolModuloAcceso.upsert({
        where: {
          rol_id_permiso_modulo_id: {
            rol_id: rol.id,
            permiso_modulo_id: permiso.id,
          },
        },
        update: { acceso_otorgado },
        create: {
          rol_id: rol.id,
          permiso_modulo_id: permiso.id,
          acceso_otorgado,
        },
      });
    }
  }

  console.log("✅ Seed ejecutado correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

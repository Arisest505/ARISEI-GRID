import { prisma } from "../src/lib/prisma";

async function insertarModulos() {
  try {
    const modulos = [
      {
        nombre: "Foro",
        path: "/foro",
        icono: "message-circle",
        orden_menu: 1,
        permisos: ["ver", "crear", "editar", "eliminar"]
      },
      {
        nombre: "Planes",
        path: "/plans",
        icono: "dollar-sign",
        orden_menu: 2,
        permisos: ["ver"]
      },
      {
        nombre: "Ayuda",
        path: "/help",
        icono: "help-circle",
        orden_menu: 3,
        permisos: ["ver", "crear"]
      },
      {
        nombre: "Usuarios",
        path: "/admin/usuarios",
        icono: "users",
        orden_menu: 4,
        permisos: ["ver", "crear", "editar", "eliminar"]
      },
      {
        nombre: "Contactos",
        path: "/contacts",
        icono: "phone",
        orden_menu: 5,
        permisos: ["ver"]
      }
    ];

    for (const mod of modulos) {
      const modulo = await prisma.modulo.create({
        data: {
          nombre: mod.nombre,
          path: mod.path,
          icono: mod.icono,
          orden_menu: mod.orden_menu,
          permisos: {
            create: mod.permisos.map(p => ({ nombre: p }))
          }
        }
      });

      console.log(`✅ Módulo '${modulo.nombre}' insertado.`);
    }
  } catch (error) {
    console.error("❌ Error insertando módulos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertarModulos();

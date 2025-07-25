// prisma/scripts/setupUsuarioBase.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  // Crear el único rol: Usuario
  const usuarioRol = await prisma.rol.create({
    data: { nombre: "Usuario" },
  });

  // Módulos básicos con permisos con nombre claro
  const modulos = [
    {
      nombre: "Foro",
      path: "/foro",
      icono: "message-circle",
      orden_menu: 1,
      permisos: ["Ver Incidencias", "Crear Hilos"],
    },
    {
      nombre: "Ayuda",
      path: "/help",
      icono: "help-circle",
      orden_menu: 2,
      permisos: ["Ver Ayuda"],
    },
    {
      nombre: "Contactos",
      path: "/contacts",
      icono: "phone",
      orden_menu: 3,
      permisos: ["Ver Contactos"],
    },
  ];

  for (const mod of modulos) {
    const modulo = await prisma.modulo.create({
      data: {
        nombre: mod.nombre,
        path: mod.path,
        icono: mod.icono,
        orden_menu: mod.orden_menu,
        permisos: {
          create: mod.permisos.map((permisoNombre) => ({
            nombre: permisoNombre,
          })),
        },
      },
      include: { permisos: true },
    });

    // Asignar permisos a Usuario
    for (const permiso of modulo.permisos) {
      const permitido = ["Ver Incidencias", "Crear Hilos", "Ver Ayuda", "Ver Contactos"].includes(permiso.nombre);

      await prisma.rolModuloAcceso.create({
        data: {
          rol_id: usuarioRol.id,
          permiso_modulo_id: permiso.id,
          acceso_otorgado: permitido,
        },
      });
    }

    console.log(`✅ Módulo '${modulo.nombre}' insertado y configurado`);
  }

  console.log("✔ Configuración base terminada.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

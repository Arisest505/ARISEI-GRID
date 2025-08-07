-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "usuario" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "codigo_usuario" TEXT NOT NULL,
    "imagen_perfil_url" TEXT,
    "rol_id" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "verificado_email" BOOLEAN NOT NULL DEFAULT false,
    "ultima_conexion" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "duracion_meses" INTEGER NOT NULL,
    "es_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuscripcionUsuario" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "metodo_activacion" TEXT NOT NULL,
    "activado_por_usuario_id" TEXT,
    "fecha_activacion" TIMESTAMP(3),
    "es_renovable_automaticamente" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SuscripcionUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "codigo_usuario_ingresado" TEXT NOT NULL,
    "monto_pagado" DECIMAL(65,30) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo_pago" TEXT NOT NULL,
    "referencia_transaccion" TEXT,
    "suscripcion_id" TEXT,
    "recibido_por_usuario_id" TEXT,
    "ip_origen" TEXT,
    "qr_usado_url" TEXT,
    "medio_verificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institucion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "codigo_modular" TEXT,
    "tipo" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_por_id" TEXT NOT NULL,

    CONSTRAINT "Institucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaIncidencia" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "genero" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "imagen_url" TEXT,
    "notas_adicionales" TEXT,
    "creado_por_usuario_id" TEXT NOT NULL,

    CONSTRAINT "PersonaIncidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incidencia" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "institucion_id" TEXT,
    "creado_por_usuario_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo_incidencia" TEXT NOT NULL,
    "monto_deuda" DECIMAL(65,30),
    "fecha_incidencia" TIMESTAMP(3) NOT NULL,
    "estado_incidencia" TEXT NOT NULL,
    "confidencialidad_nivel" TEXT NOT NULL,
    "adjuntos_url" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familiar" (
    "id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "usuario_id" TEXT,

    CONSTRAINT "Familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculoFamiliarPersona" (
    "id" TEXT NOT NULL,
    "familiar_id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "tipo_vinculo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VinculoFamiliarPersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icono" TEXT,
    "orden_menu" INTEGER,
    "visible_en_menu" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermisoModulo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "modulo_id" TEXT NOT NULL,

    CONSTRAINT "PermisoModulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolModuloAcceso" (
    "rol_id" TEXT NOT NULL,
    "permiso_modulo_id" TEXT NOT NULL,
    "acceso_otorgado" BOOLEAN NOT NULL,

    CONSTRAINT "RolModuloAcceso_pkey" PRIMARY KEY ("rol_id","permiso_modulo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_codigo_usuario_key" ON "Usuario"("codigo_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_nombre_key" ON "Plan"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_referencia_transaccion_key" ON "Pago"("referencia_transaccion");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_suscripcion_id_key" ON "Pago"("suscripcion_id");

-- CreateIndex
CREATE UNIQUE INDEX "Institucion_codigo_modular_key" ON "Institucion"("codigo_modular");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaIncidencia_dni_key" ON "PersonaIncidencia"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Familiar_dni_key" ON "Familiar"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "VinculoFamiliarPersona_familiar_id_persona_id_key" ON "VinculoFamiliarPersona"("familiar_id", "persona_id");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionUsuario" ADD CONSTRAINT "SuscripcionUsuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionUsuario" ADD CONSTRAINT "SuscripcionUsuario_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuscripcionUsuario" ADD CONSTRAINT "SuscripcionUsuario_activado_por_usuario_id_fkey" FOREIGN KEY ("activado_por_usuario_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_recibido_por_usuario_id_fkey" FOREIGN KEY ("recibido_por_usuario_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_suscripcion_id_fkey" FOREIGN KEY ("suscripcion_id") REFERENCES "SuscripcionUsuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institucion" ADD CONSTRAINT "Institucion_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaIncidencia" ADD CONSTRAINT "PersonaIncidencia_creado_por_usuario_id_fkey" FOREIGN KEY ("creado_por_usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "PersonaIncidencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_institucion_id_fkey" FOREIGN KEY ("institucion_id") REFERENCES "Institucion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_creado_por_usuario_id_fkey" FOREIGN KEY ("creado_por_usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Familiar" ADD CONSTRAINT "Familiar_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoFamiliarPersona" ADD CONSTRAINT "VinculoFamiliarPersona_familiar_id_fkey" FOREIGN KEY ("familiar_id") REFERENCES "Familiar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoFamiliarPersona" ADD CONSTRAINT "VinculoFamiliarPersona_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "PersonaIncidencia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermisoModulo" ADD CONSTRAINT "PermisoModulo_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolModuloAcceso" ADD CONSTRAINT "RolModuloAcceso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolModuloAcceso" ADD CONSTRAINT "RolModuloAcceso_permiso_modulo_id_fkey" FOREIGN KEY ("permiso_modulo_id") REFERENCES "PermisoModulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

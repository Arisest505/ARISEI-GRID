import supabase from "@/supabaseClient"
import { v4 as uuidv4 } from "uuid"

export async function registerUser({
  nombre,
  apellidos,
  dni,
  email,
  telefono,
  usuario,
  password_hash
}: {
  nombre: string
  apellidos: string
  dni: string
  email: string
  telefono?: string
  usuario: string
  password_hash: string
}) {
  // Paso 1: Buscar el rol "Usuario"
  const { data: roles, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("nombre", "Usuario")
    .single()

  if (roleError || !roles) {
    throw new Error("No se pudo obtener el rol de usuario")
  }

  // Paso 2: Generar código de usuario
  const codigo = `USR-${uuidv4().split("-")[0]}`

  // Paso 3: Insertar en tabla usuarios
  const { error, data } = await supabase.from("usuarios").insert([
    {
      nombre,
      apellidos,
      dni,
      email,
      telefono,
      usuario,
      password_hash,
      codigo_usuario: codigo,
      rol_id: roles.id,
      activo: true,
      verificado_email: false
    }
  ])

  if (error) {
    throw new Error("Error al registrar usuario: " + error.message)
  }

  return data
}

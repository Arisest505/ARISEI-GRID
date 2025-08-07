export default function EjemploCargaMasivaSection() {
  return (
    <section className="w-full px-4 py-12 bg-white border border-blue-100 shadow-xl rounded-2xl max-w-[96rem] mx-auto animate-fade-in">
      <h2 className="pb-2 mb-6 text-3xl font-bold text-black border-b-2 border-blue-200">
        Ejemplo de llenado correcto
      </h2>

      <div className="overflow-x-auto border border-blue-100 rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-white">
        <table className="w-full text-sm text-left text-sky-600 font-bold table-auto min-w-[1500px]">
          <thead className="text-xs text-black uppercase bg-blue-100">
            <tr>
              {[
                "dni", "nombre_completo", "fecha_nacimiento", "genero", "telefono",
                "correo", "institucion_nombre", "codigo_modular", "tipo_institucion",
                "titulo", "descripcion", "tipo_incidencia", "monto_deuda", "fecha_incidencia",
                "estado_incidencia", "confidencialidad_nivel", "familiar_dni", "familiar_nombre", "tipo_vinculo"
              ].map((title) => (
                <th key={title} className="px-4 py-3 border border-blue-200 whitespace-nowrap">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="transition bg-white hover:bg-blue-50">
              <td className="px-4 py-2 border border-blue-100">12345678</td>
              <td className="px-4 py-2 border border-blue-100">Juan Pérez</td>
              <td className="px-4 py-2 border border-blue-100">1990-01-15</td>
              <td className="px-4 py-2 border border-blue-100">Masculino</td>
              <td className="px-4 py-2 border border-blue-100">987654321</td>
              <td className="px-4 py-2 border border-blue-100">juan.perez@example.com</td>
              <td className="px-4 py-2 border border-blue-100">Institución Nacional</td>
              <td className="px-4 py-2 border border-blue-100">MOD00123</td>
              <td className="px-4 py-2 border border-blue-100">Pública</td>
              <td className="px-4 py-2 border border-blue-100">Deuda pendiente</td>
              <td className="px-4 py-2 border border-blue-100">El alumno tiene una deuda desde el año pasado.</td>
              <td className="px-4 py-2 border border-blue-100">Económica</td>
              <td className="px-4 py-2 border border-blue-100">1200.50</td>
              <td className="px-4 py-2 border border-blue-100">10/06/2024</td>
              <td className="px-4 py-2 border border-blue-100">Pendiente</td>
              <td className="px-4 py-2 border border-blue-100">Media</td>
              <td className="px-4 py-2 border border-blue-100">87654321</td>
              <td className="px-4 py-2 border border-blue-100">María Pérez</td>
              <td className="px-4 py-2 border border-blue-100">Madre</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

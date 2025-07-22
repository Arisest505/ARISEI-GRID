import { useState } from "react";

export default function HelpQuestionForm() {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      alert("Solicitud enviada: " + question);
      setQuestion("");
    }
  };

  return (
    <section className="py-16 bg-white" id="ask">
      <div className="max-w-3xl px-6 mx-auto text-center">
        <h2 className="mb-6 text-3xl font-bold">Envía una consulta o solicitud</h2>
        <p className="mb-6 text-gray-600 text-sm">
          Puedes escribirnos sobre reportes de deuda, alertas activas, problemas de acceso, validación institucional o cualquier asunto relacionado al sistema.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Escribe tu consulta aquí..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            style={{ color: "black" }}
          />
          <button
            type="submit"
            className="px-6 py-3 font-semibold text-white transition rounded-lg bg-cyan-600 hover:bg-cyan-700"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}

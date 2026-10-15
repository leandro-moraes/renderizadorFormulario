"use client";

import { useQuestionarios } from "@/features/respostas/hooks/useQuestionarios";
import { ItemQuestionario } from "@/features/respostas/components/ItemQuestionario";

export function ListaQuestionarios() {
  const { estado } = useQuestionarios();

  if (estado.tipo === "carregando") {
    return (
      <p className="text-gray-600">Carregando formulários...</p>
    );
  }

  if (estado.tipo === "erro") {
    return (
      <p role="alert" className="text-red-700">
        Erro: {estado.mensagem}
      </p>
    );
  }

  if (estado.questionarios.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
        Nenhum formulário cadastrado ainda. Importe um JSON do Google Forms
        para começar.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {estado.questionarios.map((q) => (
        <ItemQuestionario key={q.idQuestionario} questionario={q} />
      ))}
    </ul>
  );
}
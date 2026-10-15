"use client";

import Link from "next/link";
import type { ResumoQuestionario } from "@/features/respostas/hooks/useQuestionarios";

type Props = {
  questionario: ResumoQuestionario;
};

export function ItemQuestionario({ questionario }: Props) {
  const titulo = questionario.titulo ?? "Formulário sem título";
  const data = new Date(questionario.criadoEm).toLocaleString("pt-BR");

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{titulo}</p>
        <p className="mt-1 text-sm text-gray-500">
          Cadastrado em {data}
        </p>
        {questionario.formId && (
          <p className="mt-1 truncate font-mono text-xs text-gray-400">
            {questionario.formId}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/responder/${questionario.idQuestionario}`}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Responder
        </Link>

        <Link
          href={`/respostas?questionarioId=${questionario.idQuestionario}`}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Ver respostas
        </Link>
      </div>
    </li>
  );
}
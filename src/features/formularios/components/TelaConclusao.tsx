"use client";

import Link from "next/link";
import type { RespostasSerializadas } from "@/features/respostas/types/envio.types";
import { BotaoSalvarEnvio } from "@/features/respostas/components/BotaoSalvarEnvio";

type Props = {
  questionarioId: number;
  respostas: RespostasSerializadas;
  onReiniciar: () => void;
};

export function TelaConclusao({
  questionarioId,
  respostas,
  onReiniciar,
}: Props) {
  return (
    <section className="space-y-4">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Formulário concluído
        </h2>
        <p className="mt-2 text-gray-600">
          Você chegou ao final. Salve as respostas para registrá-las.
        </p>
      </header>

      <BotaoSalvarEnvio
        questionarioId={questionarioId}
        respostas={respostas}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReiniciar}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Responder de novo
        </button>

        <Link
          href="/"
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Responder outro formulário
        </Link>

        <Link
          href={`/respostas?questionarioId=${questionarioId}`}
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Ver todas as respostas
        </Link>
      </div>
    </section>
  );
}
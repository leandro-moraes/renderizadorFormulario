"use client";

import { useState } from "react";
import Link from "next/link";
import type { RespostasComEnunciados } from "@/features/respostas/types/envio.types";
import { useSalvarEnvio } from "@/features/respostas/hooks/useSalvarEnvio";

type Props = {
  questionarioId: number;
  respostas: RespostasComEnunciados;
};

export function BotaoSalvarEnvio({
  questionarioId,
  respostas,
}: Props) {
  const { salvar, salvando, idSalvo, erro } = useSalvarEnvio();
  const [salvouAgora, setSalvouAgora] = useState(false);

  async function lidarComClique() {
    setSalvouAgora(false);
    const id = await salvar({ questionarioId, respostas });

    if (id !== null) {
      setSalvouAgora(true);
    }
  }

  if (idSalvo !== null || salvouAgora) {
    return (
      <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm text-green-900">
        <p className="font-medium">Respostas salvas com sucesso.</p>
        <p className="mt-1">Envio #{idSalvo} registrado.</p>
        <Link
          href="/respostas"
          className="mt-3 inline-block rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
        >
          Ver todas as respostas
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={lidarComClique}
        disabled={salvando}
        className={[
          "rounded-md px-5 py-2 font-medium text-white",
          salvando
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-800",
        ].join(" ")}
      >
        {salvando ? "Salvando..." : "Salvar respostas"}
      </button>

      {erro && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
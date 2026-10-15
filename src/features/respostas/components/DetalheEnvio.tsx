"use client";

import Link from "next/link";
import type { EnvioSalvo } from "@/features/respostas/types/envio.types";

type Props = {
  envio: EnvioSalvo;
};

function formatarValor(valor: unknown): string {
  if (typeof valor === "string") return valor || "(vazio)";

  if (Array.isArray(valor)) {
    if (valor.length === 0) return "(vazio)";

    // Arquivos: [{ nome: "x.pdf" }, ...]
    if (
      valor[0] &&
      typeof valor[0] === "object" &&
      "nome" in valor[0]
    ) {
      return valor
        .map((a) => `📎 ${(a as { nome: string }).nome}`)
        .join(", ");
    }

    // string[]
    return valor.join(", ");
  }

  return String(valor);
}

export function DetalheEnvio({ envio }: Props) {
  const entradas = Object.entries(envio.respostas);

  return (
    <article className="space-y-5">
      <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Envio #{envio.idResposta}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          {envio.questionarioTitulo ?? "Formulário sem título"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {new Date(envio.criadoEm).toLocaleString("pt-BR")}
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {entradas.length === 0 ? (
          <p className="text-gray-600">
            Nenhuma resposta registrada.
          </p>
        ) : (
          <dl className="divide-y divide-gray-100">
            {entradas.map(([id, valor]) => (
              <div key={id} className="py-3">
                <dt className="text-sm font-medium text-gray-500 font-mono">
                  {id}
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-gray-900">
                  {formatarValor(valor)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <Link
        href="/respostas"
        className="inline-block text-sm text-blue-700 hover:underline"
      >
        ← Voltar para a lista
      </Link>
    </article>
  );
}
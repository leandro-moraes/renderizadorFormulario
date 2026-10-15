"use client";

import Link from "next/link";
import type { EnvioSalvo } from "@/features/respostas/types/envio.types";

type Props = {
  envio: EnvioSalvo;
};

type RespostaComEnunciado = {
  enunciado: string;
  valor: unknown;
};

function possuiEnunciado(valor: unknown): valor is RespostaComEnunciado {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor) &&
    "enunciado" in valor &&
    "valor" in valor &&
    typeof valor.enunciado === "string"
  );
}

function formatarValor(valor: unknown): string {
  if (typeof valor === "string") {
    return valor || "(vazio)";
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) {
      return "(vazio)";
    }

    // Arquivos: [{ nome: "arquivo.pdf" }, ...]
    if (
      valor.every(
        (item) =>
          item !== null &&
          typeof item === "object" &&
          "nome" in item &&
          typeof item.nome === "string"
      )
    ) {
      return valor
        .map((arquivo) => `📎 ${arquivo.nome}`)
        .join(", ");
    }

    // Respostas de múltipla escolha.
    return valor
      .map((item) => String(item))
      .join(", ");
  }

  if (valor === null || valor === undefined) {
    return "(vazio)";
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
            {entradas.map(([id, registro]) => {
              const respostaNova = possuiEnunciado(registro);

              const enunciado = respostaNova
                ? registro.enunciado
                : "Enunciado não disponível para este envio antigo.";

              const valor = respostaNova
                ? registro.valor
                : registro;

              return (
                <div key={id} className="py-4">
                  <dt className="whitespace-pre-wrap font-semibold text-gray-900">
                    {enunciado}
                  </dt>

                  <dd className="mt-2 whitespace-pre-wrap text-gray-700">
                    {formatarValor(valor)}
                  </dd>
                </div>
              );
            })}
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
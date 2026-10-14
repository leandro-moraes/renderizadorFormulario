"use client";

import type { ChangeEvent } from "react";

type Props = {
  nomeArquivo: string;
  erroImportacao: string;
  onImportar: (arquivo: File) => void;
};

export function ImportadorJSON({
  nomeArquivo,
  erroImportacao,
  onImportar,
}: Props) {
  function lidarComMudanca(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    onImportar(arquivo);
  }

  return (
    <section className="mb-8 rounded-lg border bg-white p-5">
      <label htmlFor="arquivo-json" className="mb-3 block font-medium">
        Arquivo JSON
      </label>

      <input
        id="arquivo-json"
        type="file"
        accept=".json,application/json"
        onChange={lidarComMudanca}
        className="block w-full text-sm"
      />

      {nomeArquivo && (
        <p className="mt-3 text-sm text-gray-500">
          Arquivo carregado: {nomeArquivo}
        </p>
      )}

      {erroImportacao && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {erroImportacao}
        </p>
      )}
    </section>
  );
}
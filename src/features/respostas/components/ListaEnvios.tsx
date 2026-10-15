"use client";

import { useState } from "react";
import Link from "next/link";
import { useEnvios } from "@/features/respostas/hooks/useEnvios";

type Props = {
  questionarioId?: number;
};

export function ListaEnvios({ questionarioId }: Props) {
  const { estado, excluir } = useEnvios(questionarioId);
  const [excluindo, setExcluindo] = useState<number | null>(null);

  async function lidarComExcluir(id: number) {
    const confirmou = window.confirm(
      `Excluir o envio #${id}? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setExcluindo(id);

    try {
      await excluir(id);
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "Erro ao excluir."
      );
    } finally {
      setExcluindo(null);
    }
  }

  if (estado.tipo === "carregando") {
    return <p className="text-gray-600">Carregando envios...</p>;
  }

  if (estado.tipo === "erro") {
    return (
      <p role="alert" className="text-red-700">
        Erro: {estado.mensagem}
      </p>
    );
  }

  if (estado.envios.length === 0) {
    return (
      <p className="text-gray-600">
        Nenhuma resposta foi salva ainda.
      </p>
    );
  }

  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200 bg-white">
      <thead className="bg-gray-50 text-left text-sm text-gray-600">
        <tr>
          <th className="px-4 py-3">#</th>
          <th className="px-4 py-3">Formulário</th>
          <th className="px-4 py-3">Data</th>
          <th className="px-4 py-3 text-right">Ações</th>
        </tr>
      </thead>
      <tbody>
        {estado.envios.map((envio) => (
          <tr
            key={envio.idResposta}
            className="border-t border-gray-100"
          >
            <td className="px-4 py-3 font-mono text-sm">
              {envio.idResposta}
            </td>
            <td className="px-4 py-3">
              {envio.questionarioTitulo ?? "Sem título"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
              {new Date(envio.criadoEm).toLocaleString("pt-BR")}
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                href={`/respostas/${envio.idResposta}`}
                className="mr-3 text-sm text-blue-700 hover:underline"
              >
                Ver
              </Link>
              <button
                type="button"
                onClick={() => lidarComExcluir(envio.idResposta)}
                disabled={excluindo === envio.idResposta}
                className="text-sm text-red-700 hover:underline disabled:text-gray-400"
              >
                {excluindo === envio.idResposta
                  ? "Excluindo..."
                  : "Excluir"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EnvioSalvo } from "@/features/respostas/types/envio.types";
import { DetalheEnvio } from "@/features/respostas/components/DetalheEnvio";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "ok"; envio: EnvioSalvo }
  | { tipo: "erro"; mensagem: string };

type Props = {
  id: string;
};

export function RespostaDetalheCliente({ id }: Props) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    // Guarda contra prefetch: o Next pode renderizar a página
    // sem params (id vazio) durante o prefetch de rotas dinâmicas.
    // Só buscamos quando temos um id válido.
    if (!id || id === "undefined") return;

    let cancelado = false;

    async function carregar() {
      try {
        const resposta = await fetch(`/api/respostas/${id}`, {
          cache: "no-store",
        });

        if (cancelado) return;

        if (resposta.status === 404) {
          setEstado({
            tipo: "erro",
            mensagem: "Envio não encontrado.",
          });
          return;
        }

        if (!resposta.ok) {
          throw new Error(`HTTP ${resposta.status}`);
        }

        const envio = (await resposta.json()) as EnvioSalvo;

        if (!cancelado) {
          setEstado({ tipo: "ok", envio });
        }
      } catch (e) {
        if (cancelado) return;

        setEstado({
          tipo: "erro",
          mensagem:
            e instanceof Error
              ? e.message
              : "Erro ao carregar envio.",
        });
      }
    }

    void carregar();

    return () => {
      cancelado = true;
    };
  }, [id]);

  async function excluir() {
    if (!id) return;

    const confirmou = window.confirm(
      "Excluir este envio? Essa ação não pode ser desfeita."
    );
    if (!confirmou) return;

    const resposta = await fetch(`/api/respostas/${id}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      router.push("/respostas");
    } else {
      window.alert("Erro ao excluir o envio.");
    }
  }

  if (estado.tipo === "carregando") {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600">Carregando envio...</p>
        </div>
      </main>
    );
  }

  if (estado.tipo === "erro") {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-red-300 bg-red-50 p-6">
            <p className="text-red-900">{estado.mensagem}</p>
            <Link
              href="/respostas"
              className="mt-3 inline-block text-sm text-blue-700 hover:underline"
            >
              ← Voltar para a lista
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <DetalheEnvio envio={estado.envio} />

        <div className="mt-6 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={excluir}
            className="text-sm text-red-700 hover:underline"
          >
            Excluir este envio
          </button>
        </div>
      </div>
    </main>
  );
}
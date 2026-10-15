"use client";

import { useCallback, useEffect, useState } from "react";
import type { EnvioSalvo } from "@/features/respostas/types/envio.types";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "ok"; envios: EnvioSalvo[] }
  | { tipo: "erro"; mensagem: string };

export type UseEnviosRetorno = {
  estado: Estado;
  recarregar: () => Promise<void>;
  excluir: (idResposta: number) => Promise<void>;
};

export function useEnvios(
  questionarioId?: number
): UseEnviosRetorno {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  const recarregar = useCallback(async () => {
    try {
      const url = questionarioId
        ? `/api/respostas?questionarioId=${questionarioId}`
        : "/api/respostas";

      const resposta = await fetch(url, { cache: "no-store" });

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }

      const envios = (await resposta.json()) as EnvioSalvo[];
      setEstado({ tipo: "ok", envios });
    } catch (e) {
      setEstado({
        tipo: "erro",
        mensagem:
          e instanceof Error
            ? e.message
            : "Erro ao carregar envios.",
      });
    }
  }, [questionarioId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void recarregar();
  }, [recarregar]);

  const excluir = useCallback(
    async (idResposta: number) => {
      const resposta = await fetch(
        `/api/respostas/${idResposta}`,
        { method: "DELETE" }
      );

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }

      await recarregar();
    },
    [recarregar]
  );

  return { estado, recarregar, excluir };
}
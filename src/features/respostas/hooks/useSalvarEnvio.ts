"use client";

import { useCallback, useState } from "react";
import type { RespostasSerializadas } from "@/features/respostas/types/envio.types";

export type UseSalvarEnvioRetorno = {
  salvar: (payload: {
    questionarioId: number;
    respostas: RespostasSerializadas;
  }) => Promise<number | null>;
  salvando: boolean;
  idSalvo: number | null;
  erro: string;
};

export function useSalvarEnvio(): UseSalvarEnvioRetorno {
  const [salvando, setSalvando] = useState(false);
  const [idSalvo, setIdSalvo] = useState<number | null>(null);
  const [erro, setErro] = useState("");

  const salvar = useCallback(
    async (payload: {
      questionarioId: number;
      respostas: RespostasSerializadas;
    }): Promise<number | null> => {
      setSalvando(true);
      setErro("");
      setIdSalvo(null);

      try {
        const resposta = await fetch("/api/respostas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!resposta.ok) {
          const corpo = await resposta.json().catch(() => null);
          throw new Error(
            corpo?.erro ?? `HTTP ${resposta.status}`
          );
        }

        const dados = (await resposta.json()) as {
          idResposta: number;
        };

        setIdSalvo(dados.idResposta);
        return dados.idResposta;
      } catch (e) {
        setErro(
          e instanceof Error
            ? e.message
            : "Erro ao salvar respostas."
        );
        return null;
      } finally {
        setSalvando(false);
      }
    },
    []
  );

  return { salvar, salvando, idSalvo, erro };
}
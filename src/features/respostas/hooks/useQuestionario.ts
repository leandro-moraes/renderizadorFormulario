"use client";

import { useCallback, useEffect, useState } from "react";
import type { QuestionarioComFormulario } from "@/features/respostas/types/envio.types";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "ok"; questionario: QuestionarioComFormulario }
  | { tipo: "erro"; mensagem: string };

export type UseQuestionarioRetorno = {
  estado: Estado;
  recarregar: () => Promise<void>;
};

export function useQuestionario(
  idQuestionario: number | null
): UseQuestionarioRetorno {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  const recarregar = useCallback(async () => {
    if (idQuestionario === null || idQuestionario <= 0) {
      setEstado({
        tipo: "erro",
        mensagem: "ID de questionário inválido.",
      });
      return;
    }

    try {
      const resposta = await fetch(
        `/api/questionarios/${idQuestionario}`,
        { cache: "no-store" }
      );

      if (resposta.status === 404) {
        setEstado({
          tipo: "erro",
          mensagem: "Questionário não encontrado.",
        });
        return;
      }

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }

      const questionario =
        (await resposta.json()) as QuestionarioComFormulario;

      setEstado({ tipo: "ok", questionario });
    } catch (e) {
      setEstado({
        tipo: "erro",
        mensagem:
          e instanceof Error
            ? e.message
            : "Erro ao carregar questionário.",
      });
    }
  }, [idQuestionario]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void recarregar();
  }, [recarregar]);

  return { estado, recarregar };
}
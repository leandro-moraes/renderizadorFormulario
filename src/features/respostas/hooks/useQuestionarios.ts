"use client";

import { useCallback, useEffect, useState } from "react";

export type ResumoQuestionario = {
  idQuestionario: number;
  formId: string | null;
  titulo: string | null;
  criadoEm: string;
};

type Estado =
  | { tipo: "carregando" }
  | { tipo: "ok"; questionarios: ResumoQuestionario[] }
  | { tipo: "erro"; mensagem: string };

export type UseQuestionariosRetorno = {
  estado: Estado;
  recarregar: () => Promise<void>;
};

export function useQuestionarios(): UseQuestionariosRetorno {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  const recarregar = useCallback(async () => {
    try {
      const resposta = await fetch("/api/questionarios", {
        cache: "no-store",
      });

      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }

      const questionarios =
        (await resposta.json()) as ResumoQuestionario[];
      setEstado({ tipo: "ok", questionarios });
    } catch (e) {
      setEstado({
        tipo: "erro",
        mensagem:
          e instanceof Error
            ? e.message
            : "Erro ao carregar questionários.",
      });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void recarregar();
  }, [recarregar]);

  return { estado, recarregar };
}
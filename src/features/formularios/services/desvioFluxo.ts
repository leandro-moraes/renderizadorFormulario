import type {
  Opcao,
  Secao,
} from "@/features/formularios/types/formulario.types";
import type { Respostas } from "@/features/formularios/types/resposta.types";
import { obterId } from "@/features/formularios/services/construirSecoes";

export type ResultadoDesvio =
  | { tipo: "PROXIMA" }
  | { tipo: "SECAO"; indice: number }
  | { tipo: "SUBMETER" }
  | { tipo: "REINICIAR" }
  | { tipo: "DESTINO_INVALIDO"; mensagem: string };

/**
 * Localiza a primeira opção de escolha (RADIO/DROP_DOWN) com desvio.
 */
function obterDesvio(
  secao: Secao,
  respostas: Respostas
): Opcao | undefined {
  for (const item of secao.itens) {
    const pergunta = item.questionItem?.question;
    const escolha = pergunta?.choiceQuestion;

    if (
      !pergunta ||
      !escolha ||
      !["RADIO", "DROP_DOWN"].includes(escolha.type ?? "")
    ) {
      continue;
    }

    const id = obterId(item, pergunta);
    if (!id) continue;

    const resposta = respostas[id];
    if (typeof resposta !== "string") continue;

    const opcao = escolha.options?.find(
      (itemOpcao) => itemOpcao.value === resposta
    );

    if (opcao?.goToSectionId || opcao?.goToAction) {
      return opcao;
    }
  }

  return undefined;
}

export function calcularProximoDestino(params: {
  secaoAtual: Secao;
  secoes: Secao[];
  indiceSecao: number;
  respostas: Respostas;
}): ResultadoDesvio {
  const { secaoAtual, secoes, indiceSecao, respostas } = params;

  const desvio = obterDesvio(secaoAtual, respostas);

  if (desvio?.goToAction === "SUBMIT_FORM") {
    return { tipo: "SUBMETER" };
  }

  if (desvio?.goToAction === "RESTART_FORM") {
    return { tipo: "REINICIAR" };
  }

  if (desvio?.goToSectionId) {
    const destino = secoes.findIndex(
      (secao) => secao.id === desvio.goToSectionId
    );

    if (destino >= 0) {
      return { tipo: "SECAO", indice: destino };
    }

    return {
      tipo: "DESTINO_INVALIDO",
      mensagem:
        "O destino configurado não foi encontrado. O fluxo seguirá para a próxima seção.",
    };
  }

  return { tipo: "PROXIMA" };
}
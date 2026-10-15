import type { Respostas } from "@/features/formularios/types/resposta.types";
import type {
  ArquivoSalvo,
  RespostaSerializada,
  RespostasSerializadas,
} from "@/features/respostas/types/envio.types";

import type { FormularioGoogle } from "@/features/formularios/types/formulario.types";
import { obterId } from "@/features/formularios/services/construirSecoes";
import type {
  RespostasComEnunciados,
} from "@/features/respostas/types/envio.types";

/**
 * Converte o estado interno de respostas (`Respostas`) em algo
 * seguro para enviar como JSON ao backend.
 *
 * Regras:
 * - `string` → mantém
 * - `string[]` → mantém
 * - `File[]` → vira `{ nome: string }[]`
 */
export function serializarRespostas(
  respostas: Respostas
): RespostasSerializadas {
  const saida: RespostasSerializadas = {};

  for (const [id, resposta] of Object.entries(respostas)) {
    saida[id] = serializarResposta(resposta);
  }

  return saida;
}

function serializarResposta(
  resposta: Respostas[string]
): RespostaSerializada {
  if (typeof resposta === "string") {
    return resposta;
  }

  if (Array.isArray(resposta)) {
    // Pode ser string[] ou File[]
    if (resposta.length === 0) {
      return [];
    }

    // Discrimina pelo primeiro elemento
    if (typeof resposta[0] === "string") {
      return resposta as string[];
    }

    // É File[]
    return (resposta as File[]).map(
      (arquivo): ArquivoSalvo => ({ nome: arquivo.name })
    );
  }

  return "";
}

/**
 * Prepara as respostas para persistência, associando cada
 * resposta ao enunciado original do formulário.
 *
 * A serialização dos valores continua usando as regras existentes
 * para textos, listas de opções e nomes de arquivos.
 */
export function serializarRespostasComEnunciados(
  respostas: Respostas,
  formulario: FormularioGoogle
): RespostasComEnunciados {
  const respostasSerializadas = serializarRespostas(respostas);
  const saida: RespostasComEnunciados = {};

  for (const item of formulario.items) {
    const pergunta = item.questionItem?.question;

    if (!pergunta) continue;

    const id = obterId(item, pergunta);

    if (!id || !(id in respostasSerializadas)) continue;

    saida[id] = {
      enunciado: item.title?.trim() || "Enunciado não disponível",
      valor: respostasSerializadas[id],
    };
  }

  return saida;
}
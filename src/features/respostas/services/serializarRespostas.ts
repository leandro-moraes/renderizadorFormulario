import type { Respostas } from "@/features/formularios/types/resposta.types";
import type {
  ArquivoSalvo,
  RespostaSerializada,
  RespostasSerializadas,
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
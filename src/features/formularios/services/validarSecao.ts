import type { Secao } from "@/features/formularios/types/formulario.types";
import type {
  ErrosValidacao,
  Respostas,
} from "@/features/formularios/types/resposta.types";
import {
  obterId,
  obterNomePergunta,
} from "@/features/formularios/services/construirSecoes";
import { formatarTamanho } from "@/features/formularios/services/formatarTamanho";

const TAMANHO_MAXIMO_PADRAO = 10 * 1024 * 1024;

export type ContextoValidacao = {
  secao: Secao;
  respostas: Respostas;
};

export function validarSecao({
  secao,
  respostas,
}: ContextoValidacao): ErrosValidacao {
  const novosErros: ErrosValidacao = {};

  function adicionarErro(id: string, texto: string) {
    if (!novosErros[id]) {
      novosErros[id] = [];
    }

    novosErros[id].push(texto);
  }

  for (const item of secao.itens) {
    const pergunta = item.questionItem?.question;
    if (!pergunta) continue;

    const id = obterId(item, pergunta);
    if (!id) continue;

    const nome = obterNomePergunta(item);
    const resposta = respostas[id];

    const preenchida =
      typeof resposta === "string"
        ? resposta.trim().length > 0
        : Array.isArray(resposta) && resposta.length > 0;

    if (pergunta.required === true && !preenchida) {
      adicionarErro(
        id,
        `A pergunta "${nome}" é obrigatória. Para continuar, você deve respondê-la.`
      );
    }

    const config = pergunta.fileUploadQuestion;
    if (!config || !Array.isArray(resposta)) continue;

    const arquivos = resposta.filter(
      (valor): valor is File => typeof valor !== "string"
    );

    const quantidadeMaxima = config.maxFiles ?? 1;
    const tamanhoMaximo = config.maxFileSize ?? TAMANHO_MAXIMO_PADRAO;

    if (arquivos.length > quantidadeMaxima) {
      adicionarErro(
        id,
        `A pergunta "${nome}" permite anexar no máximo ${quantidadeMaxima} arquivo(s). Você selecionou ${arquivos.length}.`
      );
    }

    for (const arquivo of arquivos) {
      if (arquivo.size > tamanhoMaximo) {
        adicionarErro(
          id,
          `O arquivo "${arquivo.name}" excede o tamanho máximo permitido de ${formatarTamanho(tamanhoMaximo)}. O tamanho do arquivo é ${formatarTamanho(arquivo.size)}.`
        );
      }
    }

    const tiposPermitidos = (config.types ?? []).map((tipo) =>
      tipo.replace(/^\./, "").toUpperCase()
    );

    if (tiposPermitidos.length > 0) {
      for (const arquivo of arquivos) {
        const extensao = arquivo.name.includes(".")
          ? arquivo.name.split(".").pop()?.toUpperCase()
          : undefined;

        if (!extensao || !tiposPermitidos.includes(extensao)) {
          adicionarErro(
            id,
            `O arquivo "${arquivo.name}" não é permitido na pergunta "${nome}". Formatos aceitos: ${tiposPermitidos.join(", ")}.`
          );
        }
      }
    }
  }

  return novosErros;
}
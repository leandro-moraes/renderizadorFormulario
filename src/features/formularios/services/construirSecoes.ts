import type {
  ItemFormulario,
  Pergunta,
  Secao,
} from "@/features/formularios/types/formulario.types";

/**
 * Organiza os itens em seções usando os marcadores de quebra de página.
 */
export function construirSecoes(itens: ItemFormulario[]): Secao[] {
  const secoes: Secao[] = [];

  let atual: Secao = {
    id: "__inicio__",
    titulo: "",
    itens: [],
  };

  itens.forEach((item, indice) => {
    if (item.pageBreakItem !== undefined) {
      if (atual.itens.length > 0 || atual.titulo) {
        secoes.push(atual);
      }

      atual = {
        id: item.itemId ?? `secao-${indice}`,
        titulo: item.title ?? "",
        descricao: item.description,
        itens: [],
      };

      return;
    }

    atual.itens.push(item);
  });

  if (
    atual.itens.length > 0 ||
    atual.titulo ||
    secoes.length === 0
  ) {
    secoes.push(atual);
  }

  return secoes;
}

/**
 * Obtém o identificador da pergunta.
 */
export function obterId(
  item: ItemFormulario,
  pergunta: Pergunta
): string | undefined {
  return pergunta.questionId ?? item.itemId;
}

/**
 * Retorna o título da pergunta ou um texto padrão.
 */
export function obterNomePergunta(item: ItemFormulario): string {
  return item.title?.trim() || "Pergunta sem título";
}
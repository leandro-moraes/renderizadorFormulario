import type { FormularioGoogle } from "@/features/formularios/types/formulario.types";

/**
 * Lê o JSON importado e verifica sua estrutura básica.
 */
export function importarFormularioJSON(
  conteudo: string
): FormularioGoogle {
  let dados: unknown;

  try {
    dados = JSON.parse(conteudo);
  } catch {
    throw new Error("O arquivo não contém um JSON válido.");
  }

  if (
    typeof dados !== "object" ||
    dados === null ||
    !("items" in dados) ||
    !Array.isArray((dados as { items: unknown }).items)
  ) {
    throw new Error(
      "O arquivo não contém a estrutura esperada do Google Forms."
    );
  }

  return dados as FormularioGoogle;
}
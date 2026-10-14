import type { FormularioGoogle } from "@/features/formularios/types/formulario.types";

type Props = {
  formulario: FormularioGoogle;
  indiceSecao: number;
  totalSecoes: number;
};

export function CabecalhoFormulario({
  formulario,
  indiceSecao,
  totalSecoes,
}: Props) {
  return (
    <header className="rounded-lg border border-gray-200 border-t-8 border-t-blue-700 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">
        {formulario.info?.title ??
          formulario.info?.documentTitle ??
          "Formulário sem título"}
      </h2>

      {indiceSecao === 0 && formulario.info?.description && (
        <p className="mt-3 whitespace-pre-wrap text-gray-600">
          {formulario.info.description}
        </p>
      )}

      {totalSecoes > 1 && (
        <p className="mt-4 text-sm text-gray-500">
          Etapa {indiceSecao + 1} de {totalSecoes}
        </p>
      )}
    </header>
  );
}
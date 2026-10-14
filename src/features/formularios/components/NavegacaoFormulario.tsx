type Props = {
  podeVoltar: boolean;
  ehUltimaSecao: boolean;
  onVoltar: () => void;
};

export function NavegacaoFormulario({
  podeVoltar,
  ehUltimaSecao,
  onVoltar,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {podeVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          className="rounded-md border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
        >
          Voltar
        </button>
      )}

      <button
        type="submit"
        className="rounded-md bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800"
      >
        {ehUltimaSecao ? "Concluir" : "Continuar"}
      </button>
    </div>
  );
}
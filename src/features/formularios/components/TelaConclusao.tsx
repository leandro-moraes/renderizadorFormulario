type Props = {
  onReiniciar: () => void;
};

export function TelaConclusao({ onReiniciar }: Props) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Formulário concluído
      </h2>

      <p className="mt-2 text-gray-600">
        O fluxo chegou ao final. Nenhuma resposta foi enviada ou salva.
      </p>

      <button
        type="button"
        onClick={onReiniciar}
        className="mt-5 rounded-md border border-gray-300 px-5 py-2 hover:bg-gray-100"
      >
        Voltar ao início
      </button>
    </section>
  );
}
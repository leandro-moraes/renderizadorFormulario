type Props = {
  erros: string[];
};

export function ResumoErros({ erros }: Props) {
  if (erros.length === 0) return null;

  return (
    <section
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-300 bg-red-50 p-5 text-red-900"
    >
      <h3 className="font-semibold">
        Não foi possível continuar. Corrija os seguintes erros:
      </h3>

      <p className="mt-1 text-sm">
        Foram encontrados {erros.length} problema(s) nesta etapa.
      </p>

      <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
        {erros.map((texto, i) => (
          <li key={`resumo-erro-${i}`}>{texto}</li>
        ))}
      </ul>
    </section>
  );
}
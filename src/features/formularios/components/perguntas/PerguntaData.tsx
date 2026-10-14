type Props = {
  id: string;
  valor: string;
  invalido: boolean;
  onChange: (valor: string) => void;
};

export function PerguntaData({ id, valor, invalido, onChange }: Props) {
  const classeInput = [
    "w-full rounded-md border bg-white px-3 py-2 text-gray-900",
    "focus:outline-none focus:ring-2",
    invalido
      ? "border-red-500 focus:border-red-600 focus:ring-red-100"
      : "border-gray-300 focus:border-blue-600 focus:ring-blue-100",
  ].join(" ");

  return (
    <input
      id={id}
      type="date"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className={classeInput}
      aria-invalid={invalido}
      aria-describedby={invalido ? `erro-${id}` : undefined}
    />
  );
}
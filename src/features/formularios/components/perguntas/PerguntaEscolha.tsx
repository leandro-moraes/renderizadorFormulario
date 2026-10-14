import type {
  Opcao,
  TipoEscolha,
} from "@/features/formularios/types/formulario.types";
import type { Resposta } from "@/features/formularios/types/resposta.types";

type Props = {
  id: string;
  tipo: TipoEscolha;
  opcoes: Opcao[];
  resposta: Resposta | undefined;
  invalido: boolean;
  onChange: (valor: Resposta) => void;
};

export function PerguntaEscolha({
  id,
  tipo,
  opcoes,
  resposta,
  invalido,
  onChange,
}: Props) {
  const classeInput = [
    "w-full rounded-md border bg-white px-3 py-2 text-gray-900",
    "focus:outline-none focus:ring-2",
    invalido
      ? "border-red-500 focus:border-red-600 focus:ring-red-100"
      : "border-gray-300 focus:border-blue-600 focus:ring-blue-100",
  ].join(" ");

  const atributosErro = {
    "aria-invalid": invalido,
    "aria-describedby": invalido ? `erro-${id}` : undefined,
  };

  if (tipo === "RADIO") {
    return (
      <fieldset
        aria-describedby={invalido ? `erro-${id}` : undefined}
        aria-invalid={invalido}
        className="space-y-3"
      >
        {opcoes.map((opcao, i) => (
          <label key={`${id}-${i}`} className="flex items-start gap-3">
            <input
              id={i === 0 ? id : `${id}-${i}`}
              type="radio"
              name={id}
              value={opcao.value}
              checked={resposta === opcao.value}
              onChange={() => onChange(opcao.value)}
              className="mt-1 h-4 w-4 accent-blue-700"
            />
            <span>{opcao.value}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  if (tipo === "CHECKBOX") {
    const selecionadas = Array.isArray(resposta)
      ? resposta.filter(
          (valor): valor is string => typeof valor === "string"
        )
      : [];

    return (
      <fieldset
        aria-describedby={invalido ? `erro-${id}` : undefined}
        aria-invalid={invalido}
        className="space-y-3"
      >
        {opcoes.map((opcao, i) => (
          <label key={`${id}-${i}`} className="flex items-start gap-3">
            <input
              id={i === 0 ? id : `${id}-${i}`}
              type="checkbox"
              checked={selecionadas.includes(opcao.value)}
              onChange={(e) => {
                const novas = e.target.checked
                  ? [...selecionadas, opcao.value]
                  : selecionadas.filter(
                      (valor) => valor !== opcao.value
                    );

                onChange(novas);
              }}
              className="mt-1 h-4 w-4 accent-blue-700"
            />
            <span>{opcao.value}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  // DROP_DOWN
  return (
    <select
      id={id}
      value={typeof resposta === "string" ? resposta : ""}
      onChange={(e) => onChange(e.target.value)}
      className={classeInput}
      {...atributosErro}
    >
      <option value="">Selecione uma opção</option>
      {opcoes.map((opcao, i) => (
        <option key={`${id}-${i}`} value={opcao.value}>
          {opcao.value}
        </option>
      ))}
    </select>
  );
}
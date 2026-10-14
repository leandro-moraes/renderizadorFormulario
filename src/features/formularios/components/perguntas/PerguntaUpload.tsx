import type { Pergunta } from "@/features/formularios/types/formulario.types";
import { formatarTamanho } from "@/features/formularios/services/formatarTamanho";

const TAMANHO_MAXIMO_PADRAO = 10 * 1024 * 1024;

type Config = NonNullable<Pergunta["fileUploadQuestion"]>;

type Props = {
  id: string;
  config: Config;
  resposta: File[];
  invalido: boolean;
  onChange: (arquivos: File[]) => void;
};

export function PerguntaUpload({
  id,
  config,
  resposta,
  invalido,
  onChange,
}: Props) {
  const maxFiles = config.maxFiles ?? 1;
  const maxFileSize = config.maxFileSize ?? TAMANHO_MAXIMO_PADRAO;

  const accept = (config.types ?? [])
    .map((tipo) =>
      tipo.toUpperCase() === "PDF"
        ? ".pdf,application/pdf"
        : `.${tipo.toLowerCase()}`
    )
    .join(",");

  return (
    <div>
      <input
        id={id}
        type="file"
        multiple={maxFiles > 1}
        accept={accept}
        onChange={(e) => onChange(Array.from(e.target.files ?? []))}
        className={[
          "block w-full text-sm",
          invalido ? "text-red-700" : "",
        ].join(" ")}
        aria-invalid={invalido}
        aria-describedby={invalido ? `erro-${id}` : undefined}
      />

      <p className="mt-2 text-sm text-gray-500">
        Máximo de {maxFiles} arquivo(s); limite de{" "}
        {formatarTamanho(maxFileSize)} por arquivo.
      </p>

      {resposta.length > 0 && (
        <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
          {resposta.map((arquivo, i) => (
            <li key={`${arquivo.name}-${i}`}>
              {arquivo.name} ({formatarTamanho(arquivo.size)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
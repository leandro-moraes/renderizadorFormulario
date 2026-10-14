import type { ItemFormulario } from "@/features/formularios/types/formulario.types";
import type {
  Resposta,
  Respostas,
} from "@/features/formularios/types/resposta.types";
import {
  obterId,
  obterNomePergunta,
} from "@/features/formularios/services/construirSecoes";
import { PerguntaTexto } from "./PerguntaTexto";
import { PerguntaData } from "./PerguntaData";
import { PerguntaEscolha } from "./PerguntaEscolha";
import { PerguntaUpload } from "./PerguntaUpload";
import { PerguntaDesconhecida } from "./PerguntaDesconhecida";

type Props = {
  item: ItemFormulario;
  respostas: Respostas;
  erros: string[];
  onChange: (id: string, valor: Resposta) => void;
};

export function RenderizarPergunta({
  item,
  respostas,
  erros,
  onChange,
}: Props) {
  const pergunta = item.questionItem?.question;

  if (!pergunta) {
    return <PerguntaDesconhecida titulo={item.title} />;
  }

  const id = obterId(item, pergunta);
  if (!id) return null;

  const obrigatorio = pergunta.required === true;
  const resposta = respostas[id];
  const campoInvalido = erros.length > 0;
  const escolha = pergunta.choiceQuestion;
  const opcoes = escolha?.options ?? [];

  return (
    <section
      key={id}
      className={[
        "rounded-lg border bg-white p-5 shadow-sm",
        campoInvalido ? "border-red-300" : "border-gray-200",
      ].join(" ")}
    >
      <div className="mb-4">
        <label htmlFor={id} className="block font-medium text-gray-900">
          {obterNomePergunta(item)}
          {obrigatorio && (
            <span className="ml-1 text-red-600" aria-label="obrigatória">
              *
            </span>
          )}
        </label>

        {item.description && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
            {item.description}
          </p>
        )}
      </div>

      {pergunta.textQuestion && (
        <PerguntaTexto
          id={id}
          valor={typeof resposta === "string" ? resposta : ""}
          invalido={campoInvalido}
          multiline={pergunta.textQuestion.paragraph === true}
          onChange={(valor) => onChange(id, valor)}
        />
      )}

      {pergunta.dateQuestion && (
        <PerguntaData
          id={id}
          valor={typeof resposta === "string" ? resposta : ""}
          invalido={campoInvalido}
          onChange={(valor) => onChange(id, valor)}
        />
      )}

      {escolha?.type && (
        <PerguntaEscolha
          id={id}
          tipo={escolha.type}
          opcoes={opcoes}
          resposta={resposta}
          invalido={campoInvalido}
          onChange={(valor) => onChange(id, valor)}
        />
      )}

      {pergunta.fileUploadQuestion && (
        <PerguntaUpload
          id={id}
          config={pergunta.fileUploadQuestion}
          resposta={
            Array.isArray(resposta)
              ? resposta.filter(
                  (valor): valor is File => typeof valor !== "string"
                )
              : []
          }
          invalido={campoInvalido}
          onChange={(arquivos) => onChange(id, arquivos)}
        />
      )}

      {!pergunta.textQuestion &&
        !pergunta.dateQuestion &&
        !pergunta.choiceQuestion &&
        !pergunta.fileUploadQuestion && (
          <p className="text-sm text-amber-700">
            Tipo de pergunta ainda não implementado.
          </p>
        )}

      {campoInvalido && (
        <ul
          id={`erro-${id}`}
          role="alert"
          className="mt-4 space-y-2 rounded-md bg-red-50 p-3 text-sm text-red-800"
        >
          {erros.map((texto, i) => (
            <li key={`${id}-erro-${i}`} className="flex gap-2">
              <span aria-hidden="true" className="font-bold">
                !
              </span>
              <span>{texto}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
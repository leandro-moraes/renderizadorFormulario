"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuestionario } from "@/features/respostas/hooks/useQuestionario";
import { useRenderizadorFormulario } from "@/features/formularios/hooks/useRenderizadorFormulario";
import { CabecalhoFormulario } from "@/features/formularios/components/CabecalhoFormulario";
import { ResumoErros } from "@/features/formularios/components/ResumoErros";
import { NavegacaoFormulario } from "@/features/formularios/components/NavegacaoFormulario";
import { TelaConclusao } from "@/features/formularios/components/TelaConclusao";
import { RenderizarPergunta } from "@/features/formularios/components/perguntas/RenderizarPergunta";
import { obterId } from "@/features/formularios/services/construirSecoes";

const idQuestionario = Number(id);

const { estado } = useQuestionario(
  Number.isFinite(idQuestionario) && idQuestionario > 0
    ? idQuestionario
    : null
);

type Props = {
  id: string;
};

export function ResponderCliente({ id }: Props) {
  const idQuestionario = Number(id);

  const { estado } = useQuestionario(
    Number.isFinite(idQuestionario) ? idQuestionario : null
  );

  const f = useRenderizadorFormulario();

 useEffect(() => {
  if (!id || id === "undefined") return;

  if (estado.tipo === "ok" && f.formulario === null) {
    f.carregarFormulario(
      estado.questionario.formulario,
      estado.questionario.idQuestionario
    );
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [estado, id]);

  if (estado.tipo === "carregando") {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </main>
    );
  }

  if (estado.tipo === "erro") {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-red-300 bg-red-50 p-6">
            <p className="text-red-900">{estado.mensagem}</p>
            <Link
              href="/"
              className="mt-3 inline-block text-sm text-blue-700 hover:underline"
            >
              ← Voltar para a lista
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!f.formulario || !f.secaoAtual) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <Link
            href="/"
            className="text-sm text-blue-700 hover:underline"
          >
            ← Voltar para a lista
          </Link>
        </div>

        {!f.concluido && (
          <form
            noValidate
            onSubmit={f.continuar}
            className="space-y-5"
          >
            <CabecalhoFormulario
              formulario={f.formulario}
              indiceSecao={f.indiceSecao}
              totalSecoes={f.secoes.length}
            />

            <ResumoErros erros={f.listaErros} />

            {(f.secaoAtual.titulo || f.secaoAtual.descricao) && (
              <section className="rounded-lg border border-gray-200 bg-white p-5">
                {f.secaoAtual.titulo && (
                  <h3 className="text-xl font-semibold text-gray-900">
                    {f.secaoAtual.titulo}
                  </h3>
                )}

                {f.secaoAtual.descricao && (
                  <p className="mt-2 whitespace-pre-wrap text-gray-600">
                    {f.secaoAtual.descricao}
                  </p>
                )}
              </section>
            )}

            {f.secaoAtual.itens.map((item, indice) => {
              const pergunta = item.questionItem?.question;
              const perguntaId = pergunta
                ? obterId(item, pergunta)
                : undefined;
              const key = perguntaId ?? `item-${indice}`;

              return (
                <RenderizarPergunta
                  key={key}
                  item={item}
                  respostas={f.respostas}
                  erros={
                    perguntaId ? (f.erros[perguntaId] ?? []) : []
                  }
                  onChange={f.atualizarResposta}
                />
              );
            })}

            <NavegacaoFormulario
              podeVoltar={f.podeVoltar}
              ehUltimaSecao={f.ehUltimaSecao}
              onVoltar={f.voltar}
            />

            {f.mensagem && (
              <p
                role="status"
                className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700"
              >
                {f.mensagem}
              </p>
            )}
          </form>
        )}

        {f.concluido && f.questionarioId !== null && (
          <TelaConclusao
            questionarioId={f.questionarioId}
            respostas={f.respostasSerializadas}
            onReiniciar={f.reiniciar}
          />
        )}
      </div>
    </main>
  );
}
"use client";

import { useRenderizadorFormulario } from "@/features/formularios/hooks/useRenderizadorFormulario";
import { ImportadorJSON } from "@/features/formularios/components/ImportadorJSON";
import { CabecalhoFormulario } from "@/features/formularios/components/CabecalhoFormulario";
import { ResumoErros } from "@/features/formularios/components/ResumoErros";
import { NavegacaoFormulario } from "@/features/formularios/components/NavegacaoFormulario";
import { TelaConclusao } from "@/features/formularios/components/TelaConclusao";
import { RenderizarPergunta } from "@/features/formularios/components/perguntas/RenderizarPergunta";

export default function Home() {
  const f = useRenderizadorFormulario();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Renderizador de formulários
          </h1>
          <p className="mt-2 text-gray-600">
            Importe o JSON do Google Forms para preencher o formulário.
          </p>
        </header>

        <ImportadorJSON
          nomeArquivo={f.nomeArquivo}
          erroImportacao={f.erroImportacao}
          onImportar={f.importarArquivo}
        />

        {f.formulario && !f.concluido && f.secaoAtual && (
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
              const id =
                pergunta?.questionId ?? item.itemId ?? `item-${indice}`;

              return (
                <RenderizarPergunta
                  key={id}
                  item={item}
                  respostas={f.respostas}
                  erros={
                    pergunta?.questionId
                      ? (f.erros[pergunta.questionId] ?? [])
                      : []
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

        {f.formulario && f.concluido && (
          <TelaConclusao onReiniciar={f.reiniciar} />
        )}
      </div>
    </main>
  );
}
"use client";

import { useMemo, useState, type FormEvent } from "react";

import { construirSecoes } from "@/features/formularios/services/construirSecoes";
import { importarFormularioJSON } from "@/features/formularios/services/importacaoFormulario";
import { validarSecao } from "@/features/formularios/services/validarSecao";
import { calcularProximoDestino } from "@/features/formularios/services/desvioFluxo";
import type {
  FormularioGoogle,
  Secao,
} from "@/features/formularios/types/formulario.types";
import type {
  ErrosValidacao,
  Resposta,
  Respostas,
} from "@/features/formularios/types/resposta.types";

export type RenderizadorFormulario = {
  formulario: FormularioGoogle | null;
  secoes: Secao[];
  secaoAtual: Secao | undefined;
  indiceSecao: number;
  respostas: Respostas;
  erros: ErrosValidacao;
  listaErros: string[];
  nomeArquivo: string;
  erroImportacao: string;
  mensagem: string;
  concluido: boolean;
  podeVoltar: boolean;
  ehUltimaSecao: boolean;

  importarArquivo: (arquivo: File) => Promise<void>;
  atualizarResposta: (id: string, resposta: Resposta) => void;
  continuar: (event: FormEvent<HTMLFormElement>) => void;
  voltar: () => void;
  reiniciar: () => void;
};

export function useRenderizadorFormulario(): RenderizadorFormulario {
  const [formulario, setFormulario] = useState<FormularioGoogle | null>(null);
  const [respostas, setRespostas] = useState<Respostas>({});
  const [erros, setErros] = useState<ErrosValidacao>({});
  const [indiceSecao, setIndiceSecao] = useState(0);
  const [historico, setHistorico] = useState<number[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [erroImportacao, setErroImportacao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [concluido, setConcluido] = useState(false);

  const secoes = useMemo(
    () => (formulario ? construirSecoes(formulario.items) : []),
    [formulario]
  );

  const secaoAtual = secoes[indiceSecao];

  const listaErros = useMemo(
    () => Object.values(erros).flat(),
    [erros]
  );

  const podeVoltar = historico.length > 0;
  const ehUltimaSecao = indiceSecao === secoes.length - 1;

  async function importarArquivo(arquivo: File) {
    setErroImportacao("");
    setMensagem("");
    setErros({});
    setFormulario(null);
    setRespostas({});
    setHistorico([]);
    setIndiceSecao(0);
    setConcluido(false);
    setNomeArquivo("");

    try {
      const formularioImportado = importarFormularioJSON(
        await arquivo.text()
      );

      setFormulario(formularioImportado);
      setNomeArquivo(arquivo.name);
    } catch (e) {
      setErroImportacao(
        e instanceof Error ? e.message : "Erro ao ler o arquivo JSON."
      );
    }
  }

  function atualizarResposta(id: string, resposta: Resposta) {
    setRespostas((anterior) => ({
      ...anterior,
      [id]: resposta,
    }));

    setErros((anteriores) => {
      if (!anteriores[id]) return anteriores;

      const novos = { ...anteriores };
      delete novos[id];
      return novos;
    });

    setMensagem("");
  }

  function navegarPara(destino: number) {
    setHistorico((anterior) => [...anterior, indiceSecao]);
    setIndiceSecao(destino);
    setErros({});
    setMensagem("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continuar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");

    if (!secaoAtual) return;

    const errosEncontrados = validarSecao({
      secao: secaoAtual,
      respostas,
    });
    setErros(errosEncontrados);

    if (Object.keys(errosEncontrados).length > 0) {
      window.setTimeout(() => {
        document
          .querySelector('[aria-invalid="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);

      return;
    }

    const resultado = calcularProximoDestino({
      secaoAtual,
      secoes,
      indiceSecao,
      respostas,
    });

    switch (resultado.tipo) {
      case "SUBMETER":
        setConcluido(true);
        return;

      case "REINICIAR":
        setHistorico([]);
        setIndiceSecao(0);
        setErros({});
        setMensagem("O fluxo retornou à primeira seção.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;

      case "SECAO":
        navegarPara(resultado.indice);
        return;

      case "DESTINO_INVALIDO":
        setMensagem(resultado.mensagem);
        // cai no fluxo padrão abaixo (mesmo comportamento do original)
        break;

      case "PROXIMA":
        break;
    }

    if (indiceSecao < secoes.length - 1) {
      navegarPara(indiceSecao + 1);
    } else {
      setConcluido(true);
    }
  }

  function voltar() {
    if (historico.length === 0) return;

    const anterior = historico[historico.length - 1];

    setHistorico((lista) => lista.slice(0, -1));
    setIndiceSecao(anterior);
    setErros({});
    setMensagem("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reiniciar() {
    setConcluido(false);
    setIndiceSecao(0);
    setHistorico([]);
    setErros({});
    setMensagem("");
  }

  return {
    formulario,
    secoes,
    secaoAtual,
    indiceSecao,
    respostas,
    erros,
    listaErros,
    nomeArquivo,
    erroImportacao,
    mensagem,
    concluido,
    podeVoltar,
    ehUltimaSecao,

    importarArquivo,
    atualizarResposta,
    continuar,
    voltar,
    reiniciar,
  };
}
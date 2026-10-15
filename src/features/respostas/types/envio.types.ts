import type { FormularioGoogle } from "@/features/formularios/types/formulario.types";

export type RespostaSerializada = string | string[] | ArquivoSalvo[];

export type ArquivoSalvo = {
  nome: string;
};

export type RespostasSerializadas = Record<string, RespostaSerializada>;

export type RespostaComEnunciado = {
  enunciado: string;
  valor: RespostaSerializada;
};

export type RespostasComEnunciados = Record<string, RespostaComEnunciado>;

export type EnvioPayload = {
  questionarioId: number;
  respostas: RespostasComEnunciados;
};

export type EnvioSalvo = {
  idResposta: number;
  questionarioId: number;
  questionarioTitulo: string | null;
  respostas: RespostasSerializadas | RespostasComEnunciados;
  criadoEm: string;
};



export type QuestionarioComFormulario = {
  idQuestionario: number;
  formId: string | null;
  titulo: string | null;
  criadoEm: string;
  atualizadoEm: string;
  formulario: FormularioGoogle;
};
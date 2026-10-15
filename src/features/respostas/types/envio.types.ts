/**
 * Representação de uma resposta pronta para envio ao backend.
 *
 * - `string` → pergunta de texto, data, radio, dropdown
 * - `string[]` → checkbox (lista de valores)
 * - `ArquivoSalvo[]` → upload (por enquanto só o nome)
 */
export type RespostaSerializada = string | string[] | ArquivoSalvo[];

/**
 * Arquivo enviado pelo usuário.
 * Por enquanto só guardamos o nome — o conteúdo e o
 * armazenamento real ficam para uma etapa futura.
 */
export type ArquivoSalvo = {
  nome: string;
};

/**
 * Mapa id da pergunta → resposta serializada.
 */
export type RespostasSerializadas = Record<string, RespostaSerializada>;

/**
 * Payload enviado ao POST /api/respostas.
 */
export type EnvioPayload = {
  questionarioId: number;
  respostas: RespostasSerializadas;
};

/**
 * Envio salvo no banco, como retornado pelo backend.
 */
export type EnvioSalvo = {
  idResposta: number;
  questionarioId: number;
  questionarioTitulo: string | null;
  respostas: RespostasSerializadas;
  criadoEm: string;
};

/**
 * Resumo do questionario (para vincular ao envio).
 */
export type QuestionarioSalvo = {
  idQuestionario: number;
  formId: string | null;
  titulo: string | null;
  criadoEm: string;
};

/**
 * Questionário completo, como retornado pelo GET /api/questionarios/[id].
 * Inclui o formulário parseado (pronto para renderizar).
 */
export type QuestionarioComFormulario = {
  idQuestionario: number;
  formId: string | null;
  titulo: string | null;
  criadoEm: string;
  atualizadoEm: string;
  formulario: import("@/features/formularios/types/formulario.types").FormularioGoogle;
};
export type GoToAction = "SUBMIT_FORM" | "RESTART_FORM";

export type TipoEscolha = "RADIO" | "CHECKBOX" | "DROP_DOWN";

export type Opcao = {
  value: string;
  goToSectionId?: string;
  goToAction?: GoToAction;
};

export type Pergunta = {
  questionId?: string;
  required?: boolean;
  textQuestion?: { paragraph?: boolean };
  dateQuestion?: { includeYear?: boolean };
  choiceQuestion?: {
    type?: TipoEscolha;
    options?: Opcao[];
  };
  fileUploadQuestion?: {
    maxFiles?: number;
    maxFileSize?: number;
    types?: string[];
  };
};

export type ItemFormulario = {
  itemId?: string;
  title?: string;
  description?: string;
  pageBreakItem?: Record<string, unknown>;
  questionItem?: { question?: Pergunta };
};

export type FormularioGoogle = {
  formId?: string;
  revisionId?: string;
  info?: {
    title?: string;
    documentTitle?: string;
    description?: string;
  };
  items: ItemFormulario[];
};

export type Secao = {
  id: string;
  titulo: string;
  descricao?: string;
  itens: ItemFormulario[];
};
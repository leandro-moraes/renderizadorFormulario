export type Resposta = string | string[] | File[];

export type Respostas = Record<string, Resposta>;

export type ErrosValidacao = Record<string, string[]>;
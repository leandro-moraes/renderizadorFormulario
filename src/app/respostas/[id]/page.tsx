export const instant = false;

import { RespostaDetalheCliente } from "./RespostaDetalheCliente";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RespostaDetalhePage({ params }: Props) {
  const { id } = await params;

  return <RespostaDetalheCliente id={id} />;
}
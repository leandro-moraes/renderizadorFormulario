export const instant = false;

import { ResponderCliente } from "./ResponderCliente";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ResponderPage({ params }: Props) {
  const { id } = await params;

  return <ResponderCliente id={id} />;
}
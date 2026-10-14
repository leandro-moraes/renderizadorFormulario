type Props = {
  titulo?: string;
};

export function PerguntaDesconhecida({ titulo }: Props) {
  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 p-5">
      Elemento não reconhecido: {titulo ?? "Sem título"}
    </section>
  );
}
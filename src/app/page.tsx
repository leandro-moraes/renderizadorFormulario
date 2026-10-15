import { ListaQuestionarios } from "@/features/respostas/components/ListaQuestionarios";
import { ImportadorJSON } from "@/features/formularios/components/ImportadorJSON";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            Formulários disponíveis
          </h1>
          <p className="mt-2 text-gray-600">
            Escolha um formulário para responder ou importe um novo.
          </p>
        </header>

        <ImportadorJSON />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Cadastrados
          </h2>
          <ListaQuestionarios />
        </section>
      </div>
    </main>
  );
}
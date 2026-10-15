
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListaEnvios } from "@/features/respostas/components/ListaEnvios";

function ConteudoRespostas() {
  const searchParams = useSearchParams();
  const valorQuestionarioId = searchParams.get("questionarioId");

  const questionarioId =
    valorQuestionarioId && /^\d+$/.test(valorQuestionarioId)
      ? Number(valorQuestionarioId)
      : undefined;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-blue-700 hover:underline"
          >
            ← Voltar ao início
          </Link>

          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Respostas enviadas
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Consulte os envios registrados no sistema.
          </p>
        </div>

        <ListaEnvios questionarioId={questionarioId} />
      </div>
    </main>
  );
}

export default function RespostasPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-10">
          <p className="text-gray-600">Carregando respostas...</p>
        </main>
      }
    >
      <ConteudoRespostas />
    </Suspense>
  );
}

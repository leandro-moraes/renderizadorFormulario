"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { importarFormularioJSON } from "@/features/formularios/services/importacaoFormulario";

export function ImportadorJSON() {
  const router = useRouter();

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");

  async function lidarComMudanca(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    setErro("");
    setNomeArquivo(arquivo.name);
    setEnviando(true);

    try {
      // 1. Lê e valida o JSON
      const texto = await arquivo.text();
      const formulario = importarFormularioJSON(texto);

      // 2. Envia para o backend (upsert por form_id)
      const resposta = await fetch("/api/questionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formulario }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => null);
        throw new Error(
          corpo?.erro ?? `Erro HTTP ${resposta.status}`
        );
      }

      const dados = (await resposta.json()) as {
        idQuestionario: number;
      };

      // 3. Redireciona para a tela de responder
      router.push(`/responder/${dados.idQuestionario}`);
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Erro ao importar o formulário."
      );
      // Limpa o input para permitir reimportar o mesmo arquivo
      event.target.value = "";
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <label
        htmlFor="arquivo-json"
        className="mb-3 block font-medium text-gray-900"
      >
        Importar novo formulário (.json do Google Forms)
      </label>

      <input
        id="arquivo-json"
        type="file"
        accept=".json,application/json"
        onChange={lidarComMudanca}
        disabled={enviando}
        className="block w-full text-sm disabled:opacity-50"
      />

      {enviando && (
        <p className="mt-3 text-sm text-gray-500">
          Processando {nomeArquivo}...
        </p>
      )}

      {erro && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {erro}
        </p>
      )}
    </section>
  );
}
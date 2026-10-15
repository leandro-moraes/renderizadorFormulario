import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import type { FormularioGoogle } from "@/features/formularios/types/formulario.types";

type QuestionarioRow = RowDataPacket & {
  id_questionario: number;
  form_id: string | null;
  titulo: string | null;
  formulario: string | FormularioGoogle;
  criado_em: Date;
  atualizado_em: Date;
};

type ContextoRota = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  contexto: ContextoRota
) {
  const { id } = await contexto.params;
  const idQuestionario = Number(id);

  if (!Number.isInteger(idQuestionario) || idQuestionario <= 0) {
    return NextResponse.json(
      { erro: "ID inválido." },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query<QuestionarioRow[]>(
      `SELECT id_questionario,
              form_id,
              titulo,
              formulario,
              criado_em,
              atualizado_em
       FROM questionario
       WHERE id_questionario = ?
       LIMIT 1`,
      [idQuestionario]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { erro: "Questionário não encontrado." },
        { status: 404 }
      );
    }

    const row = rows[0];

    // A coluna JSON pode vir como string (dependendo do driver/versão)
    // ou já como objeto. Normalizamos.
    const formulario =
      typeof row.formulario === "string"
        ? (JSON.parse(row.formulario) as FormularioGoogle)
        : row.formulario;

    return NextResponse.json({
      idQuestionario: row.id_questionario,
      formId: row.form_id,
      titulo: row.titulo,
      criadoEm: row.criado_em.toISOString(),
      atualizadoEm: row.atualizado_em.toISOString(),
      formulario,
    });
  } catch (e) {
    console.error("GET /api/questionarios/[id] falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao buscar questionário." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";
import type { FormularioGoogle } from "@/features/formularios/types/formulario.types";

type QuestionarioRow = RowDataPacket & {
  id_questionario: number;
  form_id: string | null;
  titulo: string | null;
  criado_em: Date;
};

type UpsertBody = {
  formulario: FormularioGoogle;
};

export async function GET() {
  try {
    const [rows] = await pool.query<QuestionarioRow[]>(
      `SELECT id_questionario, form_id, titulo, criado_em
       FROM questionario
       ORDER BY criado_em DESC`
    );

    return NextResponse.json(
      rows.map((row) => ({
        idQuestionario: row.id_questionario,
        formId: row.form_id,
        titulo: row.titulo,
        criadoEm: row.criado_em.toISOString(),
      }))
    );
  } catch (e) {
    console.error("GET /api/questionarios falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao listar questionários." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let corpo: UpsertBody;

  try {
    corpo = (await request.json()) as UpsertBody;
  } catch {
    return NextResponse.json(
      { erro: "JSON inválido no corpo da requisição." },
      { status: 400 }
    );
  }

  const { formulario } = corpo;

  if (!formulario || typeof formulario !== "object") {
    return NextResponse.json(
      { erro: "Campo 'formulario' é obrigatório." },
      { status: 400 }
    );
  }

  const formId = formulario.formId ?? null;
  const titulo =
    formulario.info?.title ??
    formulario.info?.documentTitle ??
    null;

  try {
    if (formId) {
      // Upsert por form_id
      const [resultado] = await pool.execute<ResultSetHeader>(
        `INSERT INTO questionario (form_id, titulo, formulario)
         VALUES (?, ?, CAST(? AS JSON))
         ON DUPLICATE KEY UPDATE
           titulo = VALUES(titulo),
           formulario = VALUES(formulario)`,
        [formId, titulo, JSON.stringify(formulario)]
      );

      // Quando ON DUPLICATE KEY UPDATE acontece, insertId é 0.
      // Nesse caso, buscamos o id pelo form_id.
      let idQuestionario = resultado.insertId;

      if (!idQuestionario) {
        const [rows] = await pool.query<QuestionarioRow[]>(
          `SELECT id_questionario FROM questionario WHERE form_id = ? LIMIT 1`,
          [formId]
        );

        if (rows.length === 0) {
          throw new Error("Questionário não encontrado após upsert.");
        }

        idQuestionario = rows[0].id_questionario;
      }

      return NextResponse.json({ idQuestionario }, { status: 201 });
    }

    // Sem form_id: sempre INSERT
    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO questionario (form_id, titulo, formulario)
       VALUES (NULL, ?, CAST(? AS JSON))`,
      [titulo, JSON.stringify(formulario)]
    );

    return NextResponse.json(
      { idQuestionario: resultado.insertId },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/questionarios falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao salvar questionário." },
      { status: 500 }
    );
  }
}
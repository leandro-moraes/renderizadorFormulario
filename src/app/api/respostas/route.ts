import { NextResponse } from "next/server";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "@/lib/db";
import type { RespostasSerializadas } from "@/features/respostas/types/envio.types";
import type { RespostasComEnunciados } from "@/features/respostas/types/envio.types";

type RespostaRow = RowDataPacket & {
  id_resposta: number;
  questionario_id_questionario: number;
  resposta: string;
  criado_em: Date;
  titulo: string | null;
};

type PostBody = {
  questionarioId: number;
 respostas: RespostasComEnunciados;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const questionarioIdParam = url.searchParams.get("questionarioId");
  const questionarioId = questionarioIdParam
    ? Number(questionarioIdParam)
    : null;

  try {
    const sql = `
      SELECT r.id_resposta,
             r.questionario_id_questionario,
             r.resposta,
             r.criado_em,
             q.titulo
      FROM resposta r
      INNER JOIN questionario q
        ON q.id_questionario = r.questionario_id_questionario
      ${questionarioId ? "WHERE r.questionario_id_questionario = ?" : ""}
      ORDER BY r.criado_em DESC
    `;

    const params = questionarioId ? [questionarioId] : [];

    const [rows] = await pool.query<RespostaRow[]>(sql, params);

    return NextResponse.json(
      rows.map((row) => ({
        idResposta: row.id_resposta,
        questionarioId: row.questionario_id_questionario,
        questionarioTitulo: row.titulo,
        respostas:
          typeof row.resposta === "string"
            ? JSON.parse(row.resposta)
            : row.resposta,
        criadoEm: row.criado_em.toISOString(),
      }))
    );
  } catch (e) {
    console.error("GET /api/respostas falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao listar respostas." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let corpo: PostBody;

  try {
    corpo = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json(
      { erro: "JSON inválido no corpo da requisição." },
      { status: 400 }
    );
  }

  const { questionarioId, respostas } = corpo;

  if (
    typeof questionarioId !== "number" ||
    !Number.isInteger(questionarioId) ||
    questionarioId <= 0
  ) {
    return NextResponse.json(
      { erro: "Campo 'questionarioId' é obrigatório e deve ser um inteiro positivo." },
      { status: 400 }
    );
  }

  if (!respostas || typeof respostas !== "object") {
    return NextResponse.json(
      { erro: "Campo 'respostas' é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO resposta (questionario_id_questionario, resposta)
       VALUES (?, CAST(? AS JSON))`,
      [questionarioId, JSON.stringify(respostas)]
    );

    return NextResponse.json(
      { idResposta: resultado.insertId },
      { status: 201 }
    );
  } catch (e: unknown) {
    // FK violation: questionarioId não existe
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code: string }).code === "ER_NO_REFERENCED_ROW_2"
    ) {
      return NextResponse.json(
        { erro: "Questionário informado não existe." },
        { status: 404 }
      );
    }

    console.error("POST /api/respostas falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao salvar respostas." },
      { status: 500 }
    );
  }
}
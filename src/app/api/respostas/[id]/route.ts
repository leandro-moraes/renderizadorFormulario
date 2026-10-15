import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";

type RespostaRow = RowDataPacket & {
  id_resposta: number;
  questionario_id_questionario: number;
  resposta: string;
  criado_em: Date;
  titulo: string | null;
};

type ContextoRota = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  contexto: ContextoRota
) {
  const { id } = await contexto.params;
  const idResposta = Number(id);

  if (!Number.isInteger(idResposta) || idResposta <= 0) {
    return NextResponse.json(
      { erro: "ID inválido." },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query<RespostaRow[]>(
      `SELECT r.id_resposta,
              r.questionario_id_questionario,
              r.resposta,
              r.criado_em,
              q.titulo
       FROM resposta r
       INNER JOIN questionario q
         ON q.id_questionario = r.questionario_id_questionario
       WHERE r.id_resposta = ?
       LIMIT 1`,
      [idResposta]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { erro: "Resposta não encontrada." },
        { status: 404 }
      );
    }

    const row = rows[0];

    return NextResponse.json({
      idResposta: row.id_resposta,
      questionarioId: row.questionario_id_questionario,
      questionarioTitulo: row.titulo,
      respostas:
        typeof row.resposta === "string"
          ? JSON.parse(row.resposta)
          : row.resposta,
      criadoEm: row.criado_em.toISOString(),
    });
  } catch (e) {
    console.error("GET /api/respostas/[id] falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao buscar resposta." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  contexto: ContextoRota
) {
  const { id } = await contexto.params;
  const idResposta = Number(id);

  if (!Number.isInteger(idResposta) || idResposta <= 0) {
    return NextResponse.json(
      { erro: "ID inválido." },
      { status: 400 }
    );
  }

  try {
    const [resultado] = await pool.execute<ResultSetHeader>(
      `DELETE FROM resposta WHERE id_resposta = ?`,
      [idResposta]
    );

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        { erro: "Resposta não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/respostas/[id] falhou:", e);
    return NextResponse.json(
      { erro: "Erro ao excluir resposta." },
      { status: 500 }
    );
  }
}
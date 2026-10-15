import "server-only";
import mysql, { type Pool } from "mysql2/promise";

/**
 * Pool de conexões MySQL.
 * Reaproveitado entre chamadas de Route Handlers.
 */

declare global {
  var __mysqlPool: Pool | undefined;
}

function criarPool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4",
  });
}

// Em dev, o Next faz hot reload — evitamos criar pools infinitos
// guardando a instância em `globalThis`.
export const pool: Pool =
  global.__mysqlPool ?? (global.__mysqlPool = criarPool());
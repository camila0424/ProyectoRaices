import pool from "../../config/db";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  full_name: string;
  email: string;
  role: string;
  city_id: number;
  ciudad: string;
  is_available: boolean;
  bio: string;
}

export async function obtenerPerfil(userId: string) {
  const [rows] = await pool.query<UserRow[]>(
    `SELECT u.id, u.full_name, u.email, u.role, u.is_available, u.bio,
            c.name as ciudad
     FROM users u
     LEFT JOIN cities c ON u.city_id = c.id
     WHERE u.id = ? AND u.is_active = true`,
    [userId]
  );

  if (rows.length === 0) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  return rows[0];
}

export async function obtenerCandidatosDisponibles(ciudad?: string) {
  let query = `
    SELECT u.id, u.full_name, u.role, u.bio, u.is_available,
           c.name as ciudad
    FROM users u
    LEFT JOIN cities c ON u.city_id = c.id
    WHERE u.role = 'worker' 
      AND u.is_active = true 
      AND u.is_available = true
  `;

  const params: string[] = [];

  if (ciudad) {
    query += " AND c.name = ?";
    params.push(ciudad);
  }

  query += " ORDER BY u.created_at DESC LIMIT 50";

  const [rows] = await pool.query<UserRow[]>(query, params);
  return rows;
}

export async function actualizarPerfil(
  userId: string,
  datos: { bio?: string; is_available?: boolean }
) {
  await pool.query(
    "UPDATE users SET bio = COALESCE(?, bio), is_available = COALESCE(?, is_available), updated_at = NOW() WHERE id = ?",
    [datos.bio ?? null, datos.is_available ?? null, userId]
  );

  return obtenerPerfil(userId);
}
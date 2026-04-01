import pool from "../../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface ApplicationRow extends RowDataPacket {
  id: number;
  job_id: string;
  worker_id: string;
  status: string;
  cover_note: string;
  created_at: Date;
  titulo: string;
  empresa: string;
  ciudad: string;
}

export async function aplicarEmpleo(workerId: string, jobId: string, nota?: string) {
  const [existe] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM applications WHERE job_id = ? AND worker_id = ?",
    [jobId, workerId]
  );

  if (existe.length > 0) {
    throw { status: 409, message: "Ya has aplicado a este empleo" };
  }

  const [resultado] = await pool.query<ResultSetHeader>(
    `INSERT INTO applications (job_id, worker_id, cover_note, status)
     VALUES (?, ?, ?, 'pending')`,
    [jobId, workerId, nota ?? null]
  );

  await pool.query(
    "UPDATE jobs SET applications_count = applications_count + 1 WHERE id = ?",
    [jobId]
  );

  return { id: resultado.insertId, mensaje: "Candidatura enviada correctamente" };
}

export async function obtenerMisCandidaturas(workerId: string) {
  const [rows] = await pool.query<ApplicationRow[]>(
    `SELECT a.id, a.status, a.cover_note, a.created_at,
            j.title as titulo,
            u.full_name as empresa,
            c.name as ciudad
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN users u ON j.employer_id = u.id
     LEFT JOIN cities c ON j.city_id = c.id
     WHERE a.worker_id = ?
     ORDER BY a.created_at DESC`,
    [workerId]
  );

  return rows;
}

export async function obtenerCandidaturasDeEmpleo(jobId: string, employerId: string) {
  const [rows] = await pool.query<ApplicationRow[]>(
    `SELECT a.id, a.status, a.cover_note, a.created_at,
            u.full_name as candidato,
            u.email as correo
     FROM applications a
     JOIN users u ON a.worker_id = u.id
     JOIN jobs j ON a.job_id = j.id
     WHERE a.job_id = ? AND j.employer_id = ?
     ORDER BY a.created_at DESC`,
    [jobId, employerId]
  );

  return rows;
}
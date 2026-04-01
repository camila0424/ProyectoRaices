import pool from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface RegistroDTO {
  nombre: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  provincia: string;
  ciudad: string;
  documento: string;
  tipoUsuario: "worker" | "employer";
}

interface LoginDTO {
  correo: string;
  contrasena: string;
}

interface UserRow extends RowDataPacket {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
}

export async function registrarUsuario(datos: RegistroDTO) {
  const [existe] = await pool.query<UserRow[]>(
    "SELECT id FROM users WHERE email = ?",
    [datos.correo]
  );

  if (existe.length > 0) {
    throw { status: 409, message: "El correo ya está registrado" };
  }

  const passwordHash = await bcrypt.hash(datos.contrasena, 12);

  // Generar UUID manualmente
  const [uuidRow] = await pool.query<RowDataPacket[]>("SELECT UUID() as uuid");
  const userId = uuidRow[0]?.uuid as string;

  await pool.query(
    `INSERT INTO users 
      (id, email, password_hash, full_name, phone_whatsapp, role, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, true)`,
    [
      userId,
      datos.correo,
      passwordHash,
      datos.nombre,
      datos.telefono ?? null,
      datos.tipoUsuario,
    ]
  );

  // Guardar documento con el UUID correcto
  await pool.query(
    `INSERT INTO user_documents (user_id, doc_type, doc_number, status) 
     VALUES (?, 'NIE', ?, 'pending')`,
    [userId, datos.documento]
  );

  const token = jwt.sign(
    { id: userId, role: datos.tipoUsuario },
    ENV.JWT_SECRET as string,
    { expiresIn: ENV.JWT_EXPIRES_IN as unknown as number }
  );

  return {
    token,
    usuario: {
      id: userId,
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.tipoUsuario,
    },
  };
}

export async function loginUsuario(datos: LoginDTO) {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? AND is_active = true",
    [datos.correo]
  );

  if (rows.length === 0) {
    throw { status: 401, message: "Credenciales incorrectas" };
  }

  const usuario = rows[0];

  const passwordValido = await bcrypt.compare(
    datos.contrasena,
    usuario.password_hash
  );

  if (!passwordValido) {
    throw { status: 401, message: "Credenciales incorrectas" };
  }

  await pool.query(
    "UPDATE users SET last_login_at = NOW() WHERE id = ?",
    [usuario.id]
  );

const token = jwt.sign(
  { id: usuario.id, role: usuario.role },
  ENV.JWT_SECRET as string,
  { expiresIn: ENV.JWT_EXPIRES_IN as unknown as number }
);

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.full_name,
      correo: usuario.email,
      rol: usuario.role,
    },
  };
}
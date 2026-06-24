// city service v2 - forces rebuild
import pool from "../../config/db";

interface CityRow {
  id: number;
  name: string;
  region: string;
}

export async function obtenerCiudades() {
  const result = await pool.query(
    "SELECT id, name, region FROM cities WHERE is_active = TRUE ORDER BY region, name"
  );
  return result.rows as CityRow[];
}

export async function obtenerCiudadPorId(id: number): Promise<CityRow | null> {
  const result = await pool.query(
    "SELECT id, name, region FROM cities WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

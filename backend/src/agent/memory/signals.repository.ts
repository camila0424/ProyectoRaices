import pool from '../../config/db';

export type SignalType =
  | 'job_rejected'
  | 'candidate_rejected'
  | 'application_made'
  | 'preference_stated'
  | 'job_filled'
  | 'worker_hired';

export interface UserSignal {
  signalType: SignalType;
  signalValue: string;
  metadata?: Record<string, unknown>;
}

export async function recordSignal(
  userId: string,
  signal: UserSignal
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO agent_user_signals (user_id, signal_type, signal_value, metadata)
       VALUES ($1, $2, $3, $4)`,
      [userId, signal.signalType, signal.signalValue, JSON.stringify(signal.metadata || {})]
    );
  } catch (err) {
    console.error('[signals] error registrando señal:', (err as Error).message);
  }
}

export async function getRecentSignals(
  userId: string,
  limit: number = 20
): Promise<Array<{
  signalType: string;
  signalValue: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}>> {
  try {
    const { rows } = await pool.query(
      `SELECT signal_type as "signalType", signal_value as "signalValue",
              metadata, created_at as "createdAt"
       FROM agent_user_signals
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return rows;
  } catch (err) {
    console.error('[signals] error leyendo señales:', (err as Error).message);
    return [];
  }
}

export async function buildLearningContext(userId: string): Promise<string> {
  const signals = await getRecentSignals(userId, 30);
  if (signals.length === 0) return '';

  const rejectionReasons: string[] = [];
  const preferences: string[] = [];
  const applications: string[] = [];

  for (const s of signals) {
    if (s.signalType === 'job_rejected' || s.signalType === 'candidate_rejected') {
      rejectionReasons.push(s.signalValue);
    } else if (s.signalType === 'preference_stated') {
      preferences.push(s.signalValue);
    } else if (s.signalType === 'application_made') {
      applications.push(s.signalValue);
    }
  }

  const parts: string[] = [];

  if (rejectionReasons.length > 0) {
    const uniqueReasons = [...new Set(rejectionReasons)].slice(0, 5);
    parts.push(`PATRONES DE RECHAZO DETECTADOS:\n${uniqueReasons.map(r => `- ${r}`).join('\n')}\nUSA ESTOS APRENDIZAJES para no repetir sugerencias similares.`);
  }

  if (preferences.length > 0) {
    const uniquePrefs = [...new Set(preferences)].slice(0, 5);
    parts.push(`PREFERENCIAS EXPLÍCITAS:\n${uniquePrefs.map(p => `- ${p}`).join('\n')}`);
  }

  if (applications.length > 0) {
    parts.push(`HA APLICADO A: ${applications.slice(0, 5).join(', ')}`);
  }

  return parts.join('\n\n');
}

export async function getEmotionalState(userId: string): Promise<{
  currentMood: string | null;
  contextSummary: string | null;
  urgencyLevel: string | null;
} | null> {
  try {
    const { rows } = await pool.query(
      `SELECT current_mood as "currentMood",
              context_summary as "contextSummary",
              urgency_level as "urgencyLevel"
       FROM agent_emotional_state WHERE user_id = $1`,
      [userId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('[signals] error leyendo estado emocional:', (err as Error).message);
    return null;
  }
}

export async function updateEmotionalState(
  userId: string,
  state: { currentMood?: string; contextSummary?: string; urgencyLevel?: string }
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO agent_emotional_state (user_id, current_mood, context_summary, urgency_level, last_updated)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         current_mood = COALESCE($2, agent_emotional_state.current_mood),
         context_summary = COALESCE($3, agent_emotional_state.context_summary),
         urgency_level = COALESCE($4, agent_emotional_state.urgency_level),
         last_updated = NOW()`,
      [userId, state.currentMood || null, state.contextSummary || null, state.urgencyLevel || null]
    );
  } catch (err) {
    console.error('[signals] error actualizando estado emocional:', (err as Error).message);
  }
}

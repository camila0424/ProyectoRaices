import type { Request, Response } from 'express';
import pool from '../../config/db';
import { sendReportToTelegram } from '../tools/handlers';

async function submitManualReport(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const { agentType, whatWasDoing, whatWentWrong, screenOrAction, deviceInfo } = req.body;

    if (!agentType || !whatWasDoing || !whatWentWrong) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return;
    }

    if (agentType !== 'companion' && agentType !== 'recruiter') {
      res.status(400).json({ error: 'Tipo de agente no válido' });
      return;
    }

    await pool.query(
      `INSERT INTO error_reports
        (user_id, agent_type, what_was_doing, what_went_wrong, screen_or_action, source, device_info)
       VALUES ($1, $2, $3, $4, $5, 'manual', $6)`,
      [userId, agentType, whatWasDoing, whatWentWrong, screenOrAction || null, deviceInfo || null]
    );

    sendReportToTelegram({
      userId,
      agentType,
      whatWasDoing,
      whatWentWrong,
      screenOrAction,
      source: 'manual',
      deviceInfo,
    }).catch((e) => console.error('[telegram] fallo async:', e));

    res.json({ success: true, message: 'Gracias, ya lo tenemos. Vamos a revisarlo.' });
  } catch (err) {
    console.error('[submitManualReport] error:', (err as Error).message);
    res.status(500).json({ error: 'Algo salió mal guardando el reporte' });
  }
}

export default submitManualReport;

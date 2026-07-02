import type { Request, Response } from 'express';
import parseCV from './cvParser';
import applyParsedCV from './cvApplier';

async function uploadCV(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No se recibió ningún archivo' });
      return;
    }

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({ error: 'Solo se aceptan PDFs por ahora' });
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
      res.status(400).json({ error: 'El CV pesa más de 10 MB' });
      return;
    }

    const parsed = await parseCV(req.file.buffer, req.file.mimetype);
    if (!parsed) {
      res.status(500).json({ error: 'No pude leer bien tu CV. ¿Puedes intentarlo con otro formato?' });
      return;
    }

    const { appliedFields, summary } = await applyParsedCV(parsed, userId);

    res.json({
      success: true,
      appliedFields,
      summary,
      parsed,
    });
  } catch (err) {
    console.error('[cv.controller] error:', (err as Error).message);
    res.status(500).json({ error: 'Algo salió mal procesando tu CV' });
  }
}

export default uploadCV;

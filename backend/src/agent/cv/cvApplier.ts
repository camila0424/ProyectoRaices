import { executeTool } from '../tools/handlers';

async function applyParsedCV(
  parsed: any,
  userId: string
): Promise<{ appliedFields: string[]; summary: string }> {
  const appliedFields: string[] = [];

  if (parsed.fullName) {
    await executeTool('actualizar_perfil', { fullName: parsed.fullName }, userId, 'companion');
    appliedFields.push('nombre');
  }

  if (parsed.shortIntro) {
    await executeTool('guardar_disponibilidad', { shortIntro: parsed.shortIntro }, userId, 'companion');
    appliedFields.push('presentación');
  }

  if (Array.isArray(parsed.professions)) {
    for (const p of parsed.professions) {
      await executeTool(
        'guardar_profesion',
        { ...p, professionName: p.name },
        userId,
        'companion'
      );
    }
    if (parsed.professions.length > 0) appliedFields.push('experiencia');
  }

  if (Array.isArray(parsed.languages)) {
    for (const lang of parsed.languages) {
      await executeTool('guardar_idioma', lang, userId, 'companion');
    }
    if (parsed.languages.length > 0) appliedFields.push('idiomas');
  }

  if (Array.isArray(parsed.certifications)) {
    for (const cert of parsed.certifications) {
      await executeTool(
        'guardar_certificacion',
        { certificationName: cert.name, details: cert.details },
        userId,
        'companion'
      );
    }
    if (parsed.certifications.length > 0) appliedFields.push('certificaciones');
  }

  // cityGuess NO se aplica automáticamente — el CV puede tener una ciudad antigua.
  // María debe confirmar con el usuario antes de guardar.

  const summary = buildSummaryText(parsed);
  return { appliedFields, summary };
}

function buildSummaryText(parsed: any): string {
  const parts: string[] = [];
  const primary = parsed.professions?.find((p: any) => p.isPrimary) || parsed.professions?.[0];
  if (primary) {
    parts.push(
      `Veo que tienes experiencia como ${primary.name}${primary.yearsExperience ? ` con ${primary.yearsExperience} años` : ''}`
    );
  }
  if (parsed.languages?.length) {
    const langNames = parsed.languages.map((l: any) => l.language).join(', ');
    parts.push(`hablas ${langNames}`);
  }
  if (parsed.certifications?.length) {
    parts.push(
      `y tienes ${parsed.certifications.length} certificación${parsed.certifications.length === 1 ? '' : 'es'}`
    );
  }
  return parts.join(', ') + '.';
}

export default applyParsedCV;

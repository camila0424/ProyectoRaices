import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ParsedCV {
  fullName: string | null;
  shortIntro: string | null;
  professions: Array<{
    name: string;
    yearsExperience: number | null;
    hasTitle: boolean;
    titleHomologated: boolean;
    description: string | null;
    isPrimary: boolean;
  }>;
  languages: Array<{ language: string; level: string }>;
  certifications: Array<{ name: string; details: string | null }>;
  cityGuess: string | null;
}

async function parseCV(fileBuffer: Buffer, mediaType: string): Promise<ParsedCV | null> {
  try {
    const base64 = fileBuffer.toString('base64');

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: mediaType as 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analiza este CV y extrae la información profesional. Devuelve SOLO un objeto JSON válido con esta estructura exacta, sin markdown, sin backticks, sin texto adicional:

{
  "fullName": "nombre completo o null",
  "shortIntro": "2 líneas resumen profesional o null",
  "professions": [
    {
      "name": "nombre corto de profesión (ej: enfermera, sales director, panadero)",
      "yearsExperience": número entero o null,
      "hasTitle": true si tiene titulación académica de esa profesión,
      "titleHomologated": true si el título está homologado en España o UE,
      "description": "breve descripción de esa experiencia",
      "isPrimary": true solo para la profesión principal
    }
  ],
  "languages": [
    { "language": "nombre en español (español, inglés, portugués, francés, etc)", "level": "básico | intermedio | avanzado | nativo" }
  ],
  "certifications": [
    { "name": "nombre de la certificación", "details": "detalles o null" }
  ],
  "cityGuess": "ciudad de residencia si aparece en el CV o null"
}

Reglas:
- Si el CV es de una persona LATINA que vive en España, presta especial atención a homologaciones de títulos.
- Extrae TODAS las profesiones relevantes, marcando isPrimary solo en una (la más reciente o principal).
- Los años de experiencia son ENTEROS (no rangos ni strings).
- Los niveles de idioma son EXACTAMENTE una de estas 4 palabras: básico, intermedio, avanzado, nativo.
- Si un dato no aparece o no puedes deducirlo, usa null.
- NUNCA inventes datos que no estén en el CV.
- Devuelve SOLO el JSON, nada más.`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') return null;

    const raw = textBlock.text.trim();
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned) as ParsedCV;
  } catch (err) {
    console.error('[cvParser] error:', (err as Error).message);
    return null;
  }
}

export default parseCV;

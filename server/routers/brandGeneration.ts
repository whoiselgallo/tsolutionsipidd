import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { getDb } from "../db";
import { brandGenerations, brandProjects } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { storagePut } from "../storage";
import type { BriefingFormData } from "../../shared/brandData";

// ─── Build rich prompt from briefing ─────────────────────────────────────────
function buildBriefingContext(briefing: BriefingFormData): string {
  return `
BRIEFING DE MARCA:
- Nombre de la marca: ${briefing.brandName}
- Sector: ${briefing.sector || "No especificado"}
- Industria: ${briefing.industry || "No especificada"}
- Descripción: ${briefing.description || "No especificada"}
- Valores de marca: ${briefing.values || "No especificados"}
- Palabras clave: ${briefing.keywords || "No especificadas"}
- Competidores: ${briefing.competitors || "No especificados"}
- Colores primarios seleccionados: ${(briefing.primaryColors || []).join(", ") || "No seleccionados"}
- Colores secundarios: ${(briefing.secondaryColors || []).join(", ") || "No seleccionados"}
- Tipografía seleccionada: ${briefing.typographySelected || "No seleccionada"}
- Geometría del logo: ${(briefing.geometrySelected || []).join(", ") || "No seleccionada"}
- Estilo del logo: ${briefing.logoStyle || "No seleccionado"}
- Público objetivo: ${briefing.targetAge || ""} años, ${briefing.targetGender || ""}, ${briefing.targetLocation || ""}, ingresos: ${briefing.targetIncome || ""}
- Intereses del público: ${briefing.targetInterests || "No especificados"}
- Pain points del público: ${briefing.targetPain || "No especificados"}
- Nombre seleccionado: ${briefing.nameSelected || briefing.brandName}
- Notas de naming: ${briefing.nameNotes || "Ninguna"}
`.trim();
}

// ─── Personalization Score Calculator ───────────────────────────────────────
// Measures how many briefing fields were filled vs total possible fields.
// Returns a percentage (0-100). The minimum threshold required is 89%.
export function calcPersonalizationScore(briefing: BriefingFormData): number {
  const fields: Array<{ value: unknown; weight: number }> = [
    { value: briefing.brandName, weight: 15 },
    { value: briefing.sector, weight: 8 },
    { value: briefing.industry, weight: 8 },
    { value: briefing.description, weight: 5 },
    { value: briefing.values?.length, weight: 7 },
    { value: briefing.keywords, weight: 5 },
    { value: briefing.competitors?.length, weight: 5 },
    { value: briefing.primaryColors?.length, weight: 8 },
    { value: briefing.secondaryColors?.length, weight: 4 },
    { value: briefing.typographySelected, weight: 7 },
    { value: briefing.geometrySelected?.length, weight: 7 },
    { value: briefing.logoStyle, weight: 7 },
    { value: briefing.targetAge, weight: 4 },
    { value: briefing.targetGender, weight: 3 },
    { value: briefing.targetIncome, weight: 3 },
    { value: briefing.targetInterests, weight: 4 },
    { value: briefing.nameSelected || briefing.brandName, weight: 5 },
    { value: briefing.nameNotes, weight: 2 },
    { value: briefing.targetPain, weight: 3 },
  ];
  const totalWeight = fields.reduce((s, f) => s + f.weight, 0);
  const filledWeight = fields.reduce((s, f) => {
    const v = f.value;
    const filled = v !== undefined && v !== null && v !== "" && v !== 0;
    return s + (filled ? f.weight : 0);
  }, 0);
  return Math.round((filledWeight / totalWeight) * 100);
}

// ─── Save generation to DB ────────────────────────────────────────────────────
async function saveGeneration(
  userId: number,
  projectId: number,
  type: "concept" | "naming" | "logo_svg" | "mockup" | "brand_guide" | "full",
  prompt: string,
  result: string,
  model: string,
  tokens?: number
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(brandGenerations).values({
    projectId,
    userId,
    generationType: type,
    prompt: prompt.substring(0, 2000),
    result: result.substring(0, 10000),
    modelUsed: model,
    tokensUsed: tokens,
  });
}

export const brandGenerationRouter = router({
  // ── Generate Brand Concept + Naming ────────────────────────────────────────
  generateConcept: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      briefing: z.any(),
    }))
    .mutation(async ({ ctx, input }) => {
      const briefing = input.briefing as BriefingFormData;
      const context = buildBriefingContext(briefing);

      const prompt = `Eres un experto en branding y estrategia de marca con 20 años de experiencia. 
Basándote en el siguiente briefing, genera una identidad de marca completa y altamente personalizada (mínimo 89% de personalización basada en los datos del cliente).

${context}

Genera una respuesta en JSON con la siguiente estructura exacta:
{
  "concepto": {
    "titulo": "Nombre del concepto de marca (2-4 palabras)",
    "descripcion": "Descripción del concepto de marca (150-200 palabras, específica para esta marca)",
    "esencia": "La esencia de la marca en una sola frase poderosa",
    "personalidad": ["adjetivo1", "adjetivo2", "adjetivo3", "adjetivo4", "adjetivo5"],
    "propuesta_valor": "Propuesta de valor única (50-80 palabras)",
    "posicionamiento": "Declaración de posicionamiento (30-50 palabras)",
    "tono_comunicacion": "Descripción del tono y voz de la marca (30-50 palabras)"
  },
  "naming": {
    "nombre_principal": "${briefing.nameSelected || briefing.brandName}",
    "alternativas": ["nombre2", "nombre3", "nombre4"],
    "justificacion": "Por qué este nombre es perfecto para la marca (50-80 palabras)",
    "slogan_principal": "Slogan principal de la marca",
    "slogans_alternativos": ["slogan2", "slogan3"],
    "dominio_sugerido": "dominio.com"
  },
  "paleta_cromatica": {
    "color_principal": {"nombre": "nombre", "hex": "#XXXXXX", "uso": "uso principal"},
    "color_secundario": {"nombre": "nombre", "hex": "#XXXXXX", "uso": "uso secundario"},
    "color_acento": {"nombre": "nombre", "hex": "#XXXXXX", "uso": "uso acento"},
    "color_neutro": {"nombre": "nombre", "hex": "#XXXXXX", "uso": "uso neutro"},
    "justificacion": "Por qué esta paleta representa la marca"
  },
  "tipografia": {
    "principal": {"nombre": "nombre fuente", "uso": "títulos y logotipo", "peso": "700"},
    "secundaria": {"nombre": "nombre fuente", "uso": "cuerpo de texto", "peso": "400"},
    "justificacion": "Por qué esta tipografía representa la marca"
  }
}

Asegúrate de que TODA la respuesta sea específica para ${briefing.brandName} y su industria. No uses respuestas genéricas.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en branding estratégico. Siempre respondes en JSON válido, sin markdown, sin bloques de código." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const content = ((response.choices[0]?.message?.content as string) ?? "{}");
      const tokens = response.usage?.total_tokens;
      const personalizationScore = calcPersonalizationScore(briefing);

      await saveGeneration(ctx.user.id, input.projectId, "concept", prompt, content, response.model ?? "gpt-4o", tokens);

      // Update project
      const db = await getDb();
      if (db) {
        await db.update(brandProjects)
          .set({ generatedConcept: content, generatedNaming: content })
          .where(and(eq(brandProjects.id, input.projectId), eq(brandProjects.userId, ctx.user.id)));
      }

      return { content: JSON.parse(content), raw: content, personalizationScore };
    }),

  // ── Generate Logo SVG ───────────────────────────────────────────────────────
  generateLogoSvg: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      briefing: z.any(),
      concept: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const briefing = input.briefing as BriefingFormData;
      const concept = input.concept;
      const context = buildBriefingContext(briefing);

      const primaryColor = concept?.paleta_cromatica?.color_principal?.hex || "#FF6B00";
      const secondaryColor = concept?.paleta_cromatica?.color_secundario?.hex || "#1A1A2E";
      const brandName = briefing.nameSelected || briefing.brandName;
      const geometry = (briefing.geometrySelected || [])[0] || "circulo";
      const style = briefing.logoStyle || "corporativo_moderno";

      const prompt = `Eres un diseñador gráfico experto en logotipos vectoriales SVG. 
Crea un logotipo SVG profesional y único para la marca "${brandName}".

ESPECIFICACIONES:
${context}
- Concepto: ${concept?.concepto?.titulo || "Marca profesional"}
- Esencia: ${concept?.concepto?.esencia || "Calidad y confianza"}
- Color principal: ${primaryColor}
- Color secundario: ${secondaryColor}
- Geometría base: ${geometry}
- Estilo: ${style}

REQUISITOS DEL SVG:
1. Viewport: viewBox="0 0 400 200"
2. Incluir símbolo/ícono geométrico a la izquierda
3. Nombre de la marca en tipografía limpia a la derecha
4. Usar SOLO los colores especificados
5. Diseño limpio, profesional y memorable
6. El logotipo debe ser 100% vectorial y escalable

Responde ÚNICAMENTE con el código SVG completo, sin explicaciones, sin markdown, comenzando con <svg y terminando con </svg>.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en diseño vectorial SVG. Respondes ÚNICAMENTE con código SVG válido y completo, sin ningún texto adicional, sin markdown." },
          { role: "user", content: prompt },
        ],
      });

      let svgContent = ((response.choices[0]?.message?.content as string) ?? "");
      // Clean up any markdown code blocks
      svgContent = svgContent.replace(/```svg\n?/g, "").replace(/```\n?/g, "").trim();
      if (!svgContent.startsWith("<svg")) {
        const svgMatch = svgContent.match(/<svg[\s\S]*<\/svg>/);
        svgContent = svgMatch ? svgMatch[0] : generateFallbackSvg(brandName, primaryColor, secondaryColor);
      }

      await saveGeneration(ctx.user.id, input.projectId, "logo_svg", prompt, svgContent, response.model ?? "gpt-4o");

      // Update project
      const db = await getDb();
      if (db) {
        await db.update(brandProjects)
          .set({ generatedLogoSvg: svgContent })
          .where(and(eq(brandProjects.id, input.projectId), eq(brandProjects.userId, ctx.user.id)));
      }

      return { svg: svgContent };
    }),

  // ── Generate Mockup Image ───────────────────────────────────────────────────
  generateMockup: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      briefing: z.any(),
      concept: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const briefing = input.briefing as BriefingFormData;
      const concept = input.concept;
      const brandName = briefing.nameSelected || briefing.brandName;
      const primaryColor = concept?.paleta_cromatica?.color_principal?.hex || "#FF6B00";
      const style = briefing.logoStyle || "corporativo_moderno";
      const industry = briefing.industry || "tecnología";

      const imagePrompt = `Professional brand identity mockup for "${brandName}" brand. 
Industry: ${industry}. Style: ${style}. Primary color: ${primaryColor}.
Show: business card, letterhead, and phone screen with the brand logo applied.
Clean, modern, professional presentation. White background. High quality product mockup photography style.
Brand color scheme: ${primaryColor} as primary color. Minimalist and elegant design.`;

      const { url: mockupUrl } = await generateImage({
        prompt: imagePrompt,
        quality: "medium",
      });

      await saveGeneration(ctx.user.id, input.projectId, "mockup", imagePrompt, mockupUrl ?? "", "gpt-image-2");

      // Update project
      const db = await getDb();
      if (db) {
        await db.update(brandProjects)
          .set({ generatedMockupUrl: mockupUrl })
          .where(and(eq(brandProjects.id, input.projectId), eq(brandProjects.userId, ctx.user.id)));
      }

      return { url: mockupUrl };
    }),

  // ── Generate Brand Guide ────────────────────────────────────────────────────
  generateBrandGuide: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      briefing: z.any(),
      concept: z.any(),
    }))
    .mutation(async ({ ctx, input }) => {
      const briefing = input.briefing as BriefingFormData;
      const concept = input.concept;
      const brandName = briefing.nameSelected || briefing.brandName;

      const prompt = `Eres un experto en brand guidelines. Genera una guía de marca completa para "${brandName}".

CONCEPTO DE MARCA: ${JSON.stringify(concept, null, 2)}

Genera la guía en JSON con esta estructura:
{
  "brand_guide": {
    "nombre_marca": "${brandName}",
    "version": "1.0",
    "fecha": "${new Date().toISOString().split('T')[0]}",
    "uso_logo": {
      "espacio_minimo": "Siempre mantener un espacio libre equivalente a la altura de la letra principal",
      "tamano_minimo": "32px en digital, 1cm en impreso",
      "fondos_permitidos": ["blanco", "negro", "color principal"],
      "fondos_prohibidos": ["fondos con patrones complejos", "colores similares al logo"],
      "versiones": ["color completo", "monocromático negro", "monocromático blanco"]
    },
    "paleta_colores": ${JSON.stringify(concept?.paleta_cromatica || {})},
    "tipografia": ${JSON.stringify(concept?.tipografia || {})},
    "tono_voz": {
      "personalidad": ${JSON.stringify(concept?.concepto?.personalidad || [])},
      "tono": "${concept?.concepto?.tono_comunicacion || ""}",
      "palabras_clave": ["palabra1", "palabra2", "palabra3"],
      "evitar": ["término1", "término2"]
    },
    "aplicaciones": {
      "digital": ["website", "redes sociales", "app móvil", "email"],
      "impreso": ["tarjeta de presentación", "membrete", "sobre", "folleto"],
      "señaletica": ["letrero exterior", "señalización interna"]
    }
  }
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Eres un experto en brand guidelines. Respondes en JSON válido sin markdown." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const content = ((response.choices[0]?.message?.content as string) ?? "{}");
      const guide = JSON.parse(content);

      await saveGeneration(ctx.user.id, input.projectId, "brand_guide", prompt, content, response.model ?? "gpt-4o");

      const db = await getDb();
      if (db) {
        await db.update(brandProjects)
          .set({ generatedBrandGuide: guide as any, status: "completed" })
          .where(and(eq(brandProjects.id, input.projectId), eq(brandProjects.userId, ctx.user.id)));
      }

      return { guide };
    }),

  // ── Generate Name Suggestions ───────────────────────────────────────────────
  generateNames: protectedProcedure
    .input(z.object({
      projectId: z.number(),
      briefing: z.any(),
    }))
    .mutation(async ({ ctx, input }) => {
      const briefing = input.briefing as BriefingFormData;
      const context = buildBriefingContext(briefing);

      const prompt = `Eres un experto en naming de marcas. Genera 8 sugerencias de nombres únicos y memorables para esta marca.

${context}

Responde en JSON:
{
  "nombres": [
    {
      "nombre": "NombreMarca",
      "tipo": "descriptivo|evocador|abstracto|acrónimo|compuesto",
      "justificacion": "Por qué este nombre funciona (20-30 palabras)",
      "disponibilidad_dominio": ".com probablemente disponible",
      "puntuacion": 85
    }
  ]
}

Los nombres deben ser: únicos, memorables, fáciles de pronunciar, relevantes para la industria y el público objetivo.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Experto en naming de marcas. Respondes en JSON válido sin markdown." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const content = (response.choices[0]?.message?.content as string) ?? '{"nombres":[]}';
      await saveGeneration(ctx.user.id, input.projectId, "naming", prompt, content, response.model ?? "gpt-4o");

      return { names: JSON.parse(content).nombres ?? [] };
    }),
});

// ─── Fallback SVG Generator ───────────────────────────────────────────────────
function generateFallbackSvg(brandName: string, primaryColor: string, secondaryColor: string): string {
  const initials = brandName.substring(0, 2).toUpperCase();
  return `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" width="400" height="200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="200" fill="transparent"/>
  <circle cx="80" cy="100" r="60" fill="url(#grad1)" opacity="0.9"/>
  <text x="80" y="108" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" font-weight="800" fill="white">${initials}</text>
  <text x="180" y="95" font-family="Inter, sans-serif" font-size="32" font-weight="700" fill="${primaryColor}">${brandName}</text>
  <line x1="180" y1="108" x2="${180 + brandName.length * 18}" y2="108" stroke="${primaryColor}" stroke-width="2" opacity="0.4"/>
</svg>`;
}

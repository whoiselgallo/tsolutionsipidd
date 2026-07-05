// ─── Brand Data: Colores, Tipografías, Geometrías, Estilos, Industrias ────────

export interface ColorData {
  key: string;
  nombre: string;
  hex: string;
  emociones: string[];
  impacto: string;
  ideal: string[];
  combina: string[];
}

export interface TypographyData {
  key: string;
  nombre: string;
  familia: string;
  psicologia: string;
  ideal: string[];
  riesgos: string;
  preview: string;
  googleFont: string;
}

export interface GeometryData {
  key: string;
  nombre: string;
  significado: string;
  psicologia: string;
  ideal: string[];
  svgPath: string;
}

export interface LogoStyleData {
  key: string;
  nombre: string;
  sensacion: string;
  previewBg: string;
  previewText: string;
  ideal: string[];
  tipografias: string[];
  descripcion: string;
}

export interface IndustryData {
  key: string;
  nombre: string;
  icon: string;
  descripcion: string;
}

// ─── COLORES ─────────────────────────────────────────────────────────────────
export const BRAND_COLORS: ColorData[] = [
  { key: "naranja_energy", nombre: "Naranja Energy", hex: "#FF6B00", emociones: ["energía", "acción", "creatividad"], impacto: "Atención máxima y dinamismo", ideal: ["tecnología", "startups", "marketing"], combina: ["negro", "blanco", "gris_oscuro"] },
  { key: "azul_corporativo", nombre: "Azul Corporativo", hex: "#2563EB", emociones: ["confianza", "calma", "seguridad"], impacto: "Profesionalismo y fiabilidad", ideal: ["tecnología", "finanzas", "servicios B2B"], combina: ["blanco", "gris_neutro", "cian_digital"] },
  { key: "negro_moderno", nombre: "Negro Moderno", hex: "#0F172A", emociones: ["poder", "elegancia", "sofisticación"], impacto: "Autoridad y exclusividad", ideal: ["lujo", "moda", "tecnología premium"], combina: ["dorado", "blanco", "naranja_energy"] },
  { key: "blanco_puro", nombre: "Blanco Puro", hex: "#FFFFFF", emociones: ["pureza", "claridad", "orden"], impacto: "Neutralidad y limpieza visual", ideal: ["salud", "tecnología limpia", "moda minimalista"], combina: ["negro", "azul_cielo", "rojo_cereza"] },
  { key: "verde_salud", nombre: "Verde Salud", hex: "#10B981", emociones: ["naturaleza", "crecimiento", "bienestar"], impacto: "Frescura y vitalidad", ideal: ["salud", "ecología", "bienestar"], combina: ["blanco", "azul_cielo", "amarillo_solar"] },
  { key: "rojo_energico", nombre: "Rojo Enérgico", hex: "#EF4444", emociones: ["pasión", "urgencia", "fuerza"], impacto: "Llamada a la acción inmediata", ideal: ["alimentación", "deportes", "entretenimiento"], combina: ["blanco", "negro", "amarillo_vivo"] },
  { key: "morado_creativo", nombre: "Morado Creativo", hex: "#7C3AED", emociones: ["creatividad", "misterio", "innovación"], impacto: "Diferenciación y originalidad", ideal: ["arte", "tecnología creativa", "educación"], combina: ["blanco", "rosa_suave", "dorado"] },
  { key: "amarillo_vivo", nombre: "Amarillo Vivo", hex: "#F59E0B", emociones: ["optimismo", "alegría", "atención"], impacto: "Visibilidad y energía positiva", ideal: ["alimentación", "entretenimiento", "infantil"], combina: ["negro", "azul_marino", "rojo_energico"] },
  { key: "cian_digital", nombre: "Cian Digital", hex: "#06B6D4", emociones: ["tecnología", "frescura", "innovación"], impacto: "Modernidad y precisión digital", ideal: ["fintech", "SaaS", "IA"], combina: ["azul_corporativo", "negro_moderno", "blanco"] },
  { key: "rosa_moderno", nombre: "Rosa Moderno", hex: "#EC4899", emociones: ["feminidad", "creatividad", "modernidad"], impacto: "Diferenciación y calidez", ideal: ["moda", "belleza", "lifestyle"], combina: ["blanco", "negro", "morado_creativo"] },
  { key: "dorado_premium", nombre: "Dorado Premium", hex: "#D4AF37", emociones: ["lujo", "éxito", "valor"], impacto: "Exclusividad y premium", ideal: ["joyería", "hospitality", "banca privada"], combina: ["negro_moderno", "blanco_marfil", "azul_marino"] },
  { key: "gris_neutro", nombre: "Gris Neutro", hex: "#6B7280", emociones: ["neutralidad", "profesionalismo", "equilibrio"], impacto: "Sobriedad y versatilidad", ideal: ["B2B", "consultoría", "tecnología"], combina: ["azul_corporativo", "blanco", "negro"] },
  { key: "verde_oscuro", nombre: "Verde Oscuro", hex: "#065F46", emociones: ["estabilidad", "naturaleza", "confianza"], impacto: "Solidez y compromiso ambiental", ideal: ["sostenibilidad", "finanzas", "agricultura"], combina: ["dorado", "blanco_hueso", "beige"] },
  { key: "naranja_amigable", nombre: "Naranja Amigable", hex: "#FB923C", emociones: ["calidez", "accesibilidad", "cercanía"], impacto: "Amabilidad y dinamismo", ideal: ["servicios locales", "food", "retail"], combina: ["blanco", "marron_tierra", "amarillo_vivo"] },
  { key: "azul_marino", nombre: "Azul Marino", hex: "#1E3A5F", emociones: ["lealtad", "estabilidad", "tradición"], impacto: "Respetabilidad institucional", ideal: ["gobierno", "banca", "universidades"], combina: ["dorado", "blanco", "plata"] },
  { key: "turquesa", nombre: "Turquesa", hex: "#0D9488", emociones: ["creatividad", "comunicación", "equilibrio"], impacto: "Originalidad y claridad", ideal: ["comunicación", "diseño", "wellness"], combina: ["blanco", "coral", "dorado"] },
];

// ─── TIPOGRAFÍAS ──────────────────────────────────────────────────────────────
export const BRAND_TYPOGRAPHY: TypographyData[] = [
  { key: "inter", nombre: "Inter", familia: "Sans Serif Moderna", psicologia: "Neutra, limpia, extremadamente funcional", ideal: ["SaaS", "apps", "startups", "tecnología"], riesgos: "Puede sentirse demasiado neutra", preview: "Brand Identity", googleFont: "Inter" },
  { key: "montserrat", nombre: "Montserrat", familia: "Sans Serif Geométrica", psicologia: "Contemporánea, urbana, con presencia", ideal: ["retail", "moda urbana", "restaurantes modernos"], riesgos: "Muy usada en branding urbano", preview: "Brand Identity", googleFont: "Montserrat" },
  { key: "poppins", nombre: "Poppins", familia: "Sans Serif Geométrica", psicologia: "Minimalista, moderna, equilibrada", ideal: ["startups", "tecnología", "branding minimalista"], riesgos: "Puede sentirse fría", preview: "Brand Identity", googleFont: "Poppins" },
  { key: "playfair", nombre: "Playfair Display", familia: "Serif Elegante", psicologia: "Lujo, sofisticación, estética editorial", ideal: ["moda", "lujo", "marcas premium"], riesgos: "No funciona bien en tamaños pequeños", preview: "Brand Identity", googleFont: "Playfair+Display" },
  { key: "raleway", nombre: "Raleway", familia: "Sans Serif Elegante", psicologia: "Elegante, ligera, sofisticada", ideal: ["moda", "arte", "arquitectura"], riesgos: "Puede perder legibilidad en texto pequeño", preview: "Brand Identity", googleFont: "Raleway" },
  { key: "oswald", nombre: "Oswald", familia: "Sans Serif Condensada", psicologia: "Impacto, fuerza, modernidad", ideal: ["deportes", "medios", "publicidad"], riesgos: "Puede sentirse agresiva", preview: "Brand Identity", googleFont: "Oswald" },
  { key: "lato", nombre: "Lato", familia: "Sans Serif Humanista", psicologia: "Profesional pero cálida", ideal: ["consultoría", "servicios B2B", "salud"], riesgos: "Puede perder fuerza sin contraste", preview: "Brand Identity", googleFont: "Lato" },
  { key: "nunito", nombre: "Nunito", familia: "Sans Serif Soft", psicologia: "Redondeada, amigable, accesible", ideal: ["educación", "apps infantiles", "ONG"], riesgos: "No apta para sectores formales", preview: "Brand Identity", googleFont: "Nunito" },
  { key: "syne", nombre: "Syne", familia: "Sans Serif Display", psicologia: "Experimental, creativa, disruptiva", ideal: ["arte", "diseño", "agencias creativas"], riesgos: "Solo para títulos y logotipos", preview: "Brand Identity", googleFont: "Syne" },
  { key: "dm_sans", nombre: "DM Sans", familia: "Sans Serif Moderna", psicologia: "Limpia, técnica, contemporánea", ideal: ["apps", "plataformas digitales", "startups"], riesgos: "Puede sentirse genérica", preview: "Brand Identity", googleFont: "DM+Sans" },
  { key: "space_grotesk", nombre: "Space Grotesk", familia: "Sans Serif Técnica", psicologia: "Futurista, técnica, innovadora", ideal: ["IA", "crypto", "tech avanzada"], riesgos: "Muy nicho", preview: "Brand Identity", googleFont: "Space+Grotesk" },
  { key: "cormorant", nombre: "Cormorant Garamond", familia: "Serif Clásica", psicologia: "Elegancia clásica, editorial, literaria", ideal: ["lujo", "editorial", "vino"], riesgos: "Puede sentirse anticuada", preview: "Brand Identity", googleFont: "Cormorant+Garamond" },
];

// ─── GEOMETRÍAS ───────────────────────────────────────────────────────────────
export const BRAND_GEOMETRY: GeometryData[] = [
  { key: "circulo", nombre: "Círculo", significado: "Unidad, totalidad, comunidad", psicologia: "Amigabilidad, inclusión, movimiento", ideal: ["ONG", "apps sociales", "cafeterías", "marcas globales"], svgPath: "M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0" },
  { key: "cuadrado", nombre: "Cuadrado", significado: "Estabilidad, solidez, confianza", psicologia: "Orden, estructura, profesionalismo", ideal: ["banca", "construcción", "gobierno", "seguros"], svgPath: "M10,10 h80 v80 h-80 z" },
  { key: "triangulo", nombre: "Triángulo", significado: "Dirección, crecimiento, dinamismo", psicologia: "Ambición, progreso, movimiento hacia arriba", ideal: ["finanzas", "consultoría", "tecnología", "energía"], svgPath: "M50,10 L90,90 L10,90 Z" },
  { key: "hexagono", nombre: "Hexágono", significado: "Eficiencia, estructura natural, red", psicologia: "Precisión, tecnología, conexión", ideal: ["tecnología", "ciencia", "industria", "IA"], svgPath: "M50,10 L87,30 L87,70 L50,90 L13,70 L13,30 Z" },
  { key: "diamante", nombre: "Diamante", significado: "Valor, precisión, exclusividad", psicologia: "Lujo, distinción, calidad máxima", ideal: ["joyería", "lujo", "premium", "finanzas"], svgPath: "M50,10 L90,50 L50,90 L10,50 Z" },
  { key: "estrella", nombre: "Estrella", significado: "Excelencia, aspiración, reconocimiento", psicologia: "Éxito, distinción, liderazgo", ideal: ["entretenimiento", "hostelería", "premios", "retail"], svgPath: "M50,10 L61,35 L88,35 L67,57 L74,83 L50,68 L26,83 L33,57 L12,35 L39,35 Z" },
  { key: "escudo", nombre: "Escudo", significado: "Protección, seguridad, honor", psicologia: "Confianza, defensa, garantía", ideal: ["seguros", "seguridad", "deportes", "instituciones"], svgPath: "M50,10 L85,25 L85,55 Q85,80 50,90 Q15,80 15,55 L15,25 Z" },
  { key: "flecha", nombre: "Flecha", significado: "Dirección, velocidad, progreso", psicologia: "Acción, enfoque, avance", ideal: ["logística", "transporte", "tecnología", "startups"], svgPath: "M10,50 L65,50 L65,30 L90,50 L65,70 L65,50" },
  { key: "infinito", nombre: "Infinito", significado: "Continuidad, ciclo eterno, posibilidades", psicologia: "Permanencia, innovación continua, conexión", ideal: ["tecnología", "seguros", "plataformas digitales"], svgPath: "M30,50 Q30,30 50,50 Q70,70 70,50 Q70,30 50,50 Q30,70 30,50" },
  { key: "onda", nombre: "Onda", significado: "Movimiento, fluidez, naturaleza", psicologia: "Dinamismo, adaptabilidad, energía", ideal: ["música", "agua", "tecnología", "wellness"], svgPath: "M10,50 Q25,30 40,50 Q55,70 70,50 Q85,30 90,50" },
  { key: "letra_abstracta", nombre: "Monograma", significado: "Identidad única, personalización, exclusividad", psicologia: "Distinción, personalidad, reconocimiento", ideal: ["moda", "lujo", "servicios profesionales"], svgPath: "M20,80 L50,20 L80,80 M30,55 L70,55" },
  { key: "punto_conexion", nombre: "Red de Nodos", significado: "Conexión, red, colaboración", psicologia: "Tecnología, comunidad, interconexión", ideal: ["tecnología", "redes sociales", "consultoría", "IA"], svgPath: "M20,50 L50,20 L80,50 L50,80 Z M20,50 L80,50 M50,20 L50,80" },
];

// ─── ESTILOS DE LOGO ──────────────────────────────────────────────────────────
export const LOGO_STYLES: LogoStyleData[] = [
  { key: "corporativo_moderno", nombre: "Corporativo Moderno", sensacion: "Profesional, confiable, actual", previewBg: "#0F172A", previewText: "#E2E8F0", ideal: ["consultoría", "servicios B2B", "SaaS", "educación superior"], tipografias: ["Inter", "Lato"], descripcion: "Líneas limpias, geometría precisa, paleta sobria. Transmite autoridad y confianza." },
  { key: "startup_tech", nombre: "Startup Tech", sensacion: "Innovadora, ágil, futurista", previewBg: "#020617", previewText: "#E5E7EB", ideal: ["IA", "apps", "plataformas digitales", "fintech"], tipografias: ["Poppins", "Inter"], descripcion: "Formas geométricas dinámicas, gradientes digitales, tipografía moderna. Energía disruptiva." },
  { key: "lujo_clasico", nombre: "Lujo Clásico", sensacion: "Exclusiva, sofisticada, atemporal", previewBg: "#111827", previewText: "#F5F0E8", ideal: ["joyería", "hospitality premium", "banca privada", "moda de lujo"], tipografias: ["Playfair Display", "Cormorant"], descripcion: "Tipografía serif elegante, detalles dorados, espaciado generoso. Exclusividad absoluta." },
  { key: "minimalista", nombre: "Minimalista", sensacion: "Limpia, directa, memorable", previewBg: "#FAFAFA", previewText: "#111827", ideal: ["diseño", "arquitectura", "tecnología", "lifestyle"], tipografias: ["DM Sans", "Space Grotesk"], descripcion: "Menos es más. Una forma, una tipografía, máximo impacto con mínimos elementos." },
  { key: "creativo_bold", nombre: "Creativo Bold", sensacion: "Audaz, expresiva, memorable", previewBg: "#1A0A2E", previewText: "#F0E6FF", ideal: ["agencias creativas", "entretenimiento", "moda", "arte"], tipografias: ["Syne", "Oswald"], descripcion: "Tipografía expresiva, colores vibrantes, formas irregulares. Personalidad única e impactante." },
  { key: "natural_organico", nombre: "Natural Orgánico", sensacion: "Auténtica, cercana, sostenible", previewBg: "#F0FDF4", previewText: "#14532D", ideal: ["productos naturales", "agricultura", "wellness", "ONG"], tipografias: ["Nunito", "Lato"], descripcion: "Formas orgánicas, paleta terrosa, tipografía humanista. Conexión con la naturaleza." },
  { key: "retro_vintage", nombre: "Retro Vintage", sensacion: "Nostálgica, artesanal, auténtica", previewBg: "#FEF3C7", previewText: "#7B3F1D", ideal: ["cafeterías", "cervecerías", "moda vintage", "restaurantes"], tipografias: ["Raleway", "Oswald"], descripcion: "Texturas envejecidas, tipografía clásica, paleta cálida. Autenticidad y tradición." },
  { key: "futurista_neon", nombre: "Futurista Neon", sensacion: "Disruptiva, tecnológica, vanguardista", previewBg: "#050510", previewText: "#00FFFF", ideal: ["gaming", "crypto", "metaverso", "tech extrema"], tipografias: ["Orbitron", "Space Grotesk"], descripcion: "Efectos neon, gradientes eléctricos, tipografía futurista. Para marcas que rompen paradigmas." },
];

// ─── INDUSTRIAS ───────────────────────────────────────────────────────────────
export const INDUSTRIES: IndustryData[] = [
  { key: "tecnologia", nombre: "Tecnología & Software", icon: "💻", descripcion: "SaaS, apps, plataformas digitales, IA, desarrollo de software" },
  { key: "fintech", nombre: "Fintech & Finanzas", icon: "💰", descripcion: "Banca digital, pagos, inversiones, criptomonedas, seguros" },
  { key: "salud", nombre: "Salud & Wellness", icon: "🏥", descripcion: "Clínicas, apps de salud, wellness, farmacéutica, biotecnología" },
  { key: "educacion", nombre: "Educación & E-learning", icon: "🎓", descripcion: "Plataformas educativas, universidades, cursos online, edtech" },
  { key: "retail", nombre: "Retail & E-commerce", icon: "🛍️", descripcion: "Tiendas online, marketplaces, retail físico y digital" },
  { key: "alimentacion", nombre: "Alimentación & Restaurantes", icon: "🍽️", descripcion: "Restaurantes, cafeterías, food delivery, productos alimenticios" },
  { key: "moda", nombre: "Moda & Lifestyle", icon: "👗", descripcion: "Ropa, accesorios, belleza, cosmética, lifestyle" },
  { key: "inmobiliaria", nombre: "Inmobiliaria & Construcción", icon: "🏗️", descripcion: "Bienes raíces, construcción, arquitectura, diseño de interiores" },
  { key: "consultoria", nombre: "Consultoría & Servicios B2B", icon: "📊", descripcion: "Consultoría estratégica, legal, contable, recursos humanos" },
  { key: "entretenimiento", nombre: "Entretenimiento & Media", icon: "🎬", descripcion: "Cine, música, gaming, streaming, medios digitales" },
  { key: "logistica", nombre: "Logística & Transporte", icon: "🚚", descripcion: "Transporte, logística, cadena de suministro, delivery" },
  { key: "turismo", nombre: "Turismo & Hospitalidad", icon: "✈️", descripcion: "Hoteles, agencias de viaje, turismo, experiencias" },
  { key: "energia", nombre: "Energía & Sostenibilidad", icon: "⚡", descripcion: "Energías renovables, sostenibilidad, medio ambiente" },
  { key: "gobierno", nombre: "Gobierno & Sector Público", icon: "🏛️", descripcion: "Organismos gubernamentales, instituciones públicas, ONG" },
  { key: "deporte", nombre: "Deporte & Fitness", icon: "🏋️", descripcion: "Clubes deportivos, equipamiento, apps fitness, nutrición deportiva" },
  { key: "otro", nombre: "Otro / Personalizado", icon: "🌐", descripcion: "Sector no listado o combinación de múltiples industrias" },
];

// ─── Briefing Form State Type ─────────────────────────────────────────────────
export interface BriefingFormData {
  // Paso 1: Datos básicos
  brandName: string;
  sector: string;
  values: string;
  competitors: string;
  keywords: string;
  description: string;
  differentiation: string;

  // Paso 2: Colores
  primaryColors: string[];
  secondaryColors: string[];

  // Paso 3: Industria
  industry: string;
  industryCustom: string;

  // Paso 4: Tipografía
  typographySuggestions: string[];
  typographySelected: string;

  // Paso 5: Público objetivo
  targetAge: string;
  targetGender: string;
  targetLocation: string;
  targetIncome: string;
  targetInterests: string;
  targetPain: string;

  // Paso 6: Geometría
  geometrySelected: string[];

  // Paso 7: Estilo del logo
  logoStyle: string;

  // Paso 8: Brainstorming
  nameSuggestions: string[];
  nameSelected: string;
  nameNotes: string;
}

export const EMPTY_BRIEFING: BriefingFormData = {
  brandName: "",
  sector: "",
  values: "",
  competitors: "",
  keywords: "",
  description: "",
  differentiation: "",
  primaryColors: [],
  secondaryColors: [],
  industry: "",
  industryCustom: "",
  typographySuggestions: [],
  typographySelected: "",
  targetAge: "",
  targetGender: "",
  targetLocation: "",
  targetIncome: "",
  targetInterests: "",
  targetPain: "",
  geometrySelected: [],
  logoStyle: "",
  nameSuggestions: [],
  nameSelected: "",
  nameNotes: "",
};

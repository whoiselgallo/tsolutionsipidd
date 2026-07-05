# Brand Identity API — TSolutions IPIDD — TODO

## Fase 2: Schema BD y datos JSON
- [x] Schema de base de datos: tablas brand_projects, brand_generations, brand_assets
- [x] Datos JSON: colores (migrar desde brand-builder)
- [x] Datos JSON: tipografías (migrar desde brand-builder)
- [x] Datos JSON: geometrías (migrar desde brand-builder)
- [x] Datos JSON: estilos de logo (migrar desde brand-builder)
- [x] Datos JSON: industrias
- [x] tRPC routers para brand_projects y brand_data

## Fase 3: Sistema de diseño Glass UI
- [x] Variables CSS globales: fondo oscuro, glass, neon naranja #FF6B00
- [x] Efectos neon naranja en contorno de tarjetas activas
- [x] Fuentes Google: Orbitron + Syne + Inter para dashboard
- [x] Animaciones CSS: transiciones de paneles colapsables
- [x] Tema oscuro configurado en ThemeProvider

## Fase 4: Dashboard SPA unificado
- [x] Layout principal del dashboard SPA sin navegación entre páginas
- [x] 8 tarjetas de módulo: Briefing, Colores, Tipografía, Geometría, Naming, Estilo, Editor, Exportar
- [x] Cada tarjeta conectada a su panel colapsable con animación
- [x] Panel activo expandido, resto colapsados
- [x] Header con logo TSolutions IPIDD y estado del proyecto
- [x] Barra de progreso del flujo de identidad
- [x] Hero section: bienvenida inicial y estadísticas del proyecto activo

## Fase 5: Formulario multi-paso de briefing
- [x] Paso 1: Datos básicos (nombre, sector, valores, competidores)
- [x] Paso 2: Preferencias de color (selector desde JSON de colores)
- [x] Paso 3: Industria (selector desde JSON)
- [x] Paso 4: Tipografía sugerida (3 opciones desde JSON)
- [x] Paso 5: Público objetivo (edad, género, ingreso, psicografía)
- [x] Paso 6: Geometría sugerida (opciones desde JSON)
- [x] Paso 7: Estilo del logo (opciones desde JSON)
- [x] Paso 8: Brainstorming de nombres (generación LLM + captura manual)

## Fase 6: Motor LLM de generación
- [x] tRPC procedure: generateConcept (concepto + naming + paleta)
- [x] tRPC procedure: generateLogoSvg (logotipo SVG vectorial personalizado)
- [x] tRPC procedure: generateMockup (imagen de mockup con IA)
- [x] tRPC procedure: generateBrandGuide (guía de marca completa)
- [x] tRPC procedure: generateNames (8 nombres con puntuación)
- [x] Prompts con personalización ≥89% basados en briefing
- [x] Almacenamiento de generaciones en BD

## Fase 7: Editor visual interactivo
- [x] Tab Logo: previsualización SVG en tiempo real con selector de fondo
- [x] Tab Mockup: imagen de mockup generada por IA
- [x] Tab Guía de marca: paleta, tipografía, geometría, voz y tono
- [x] Controles colapsables: Colores, Tipografía, Geometría
- [x] Copia de HEX al portapapeles con feedback visual

## Fase 8: Sistema de exportación
- [x] Exportar logo SVG individual
- [x] Exportar logo PNG 512px (transparente)
- [x] Exportar logo PNG 1024px (alta resolución)
- [x] Exportar logo JPEG (fondo blanco)
- [x] Exportar datos de marca JSON completo
- [x] Exportar paleta de colores JSON
- [x] Exportar guía de marca JSON
- [x] Exportar tokens Figma JSON (design tokens)
- [x] Botón "Descargar Todo" (descarga secuencial)

## Fase 9: Persistencia y autenticación
- [x] Login con Manus OAuth obligatorio
- [x] Guardar proyecto de identidad por usuario
- [x] Historial de generaciones por proyecto
- [x] Retomar proyecto guardado (ProjectsPanel)
- [x] Lista de proyectos del usuario
- [x] Auto-creación de proyecto desde NamingPanel

## Pruebas
- [x] Tests unitarios para auth.me y auth.logout
- [x] Tests unitarios para routers de brandData (5 endpoints)
- [x] Tests de guards de autenticación en brandProjects y brandGeneration
- [x] 12/12 tests pasando

## Bug Fixes
- [x] Corregir sincronización entre contenedores: agregar campo differentiation separado para "¿Qué diferencia a tu marca?"

## Mejoras futuras (pendiente)
- [ ] Exportación ZIP con todos los archivos en un solo descargable
- [ ] Previsualización de mockup en tarjetas de marca (business card, letterhead)
- [ ] Modo colaborativo: compartir proyecto con URL
- [ ] Historial de versiones por proyecto
- [ ] Integración con Canva API para exportación directa

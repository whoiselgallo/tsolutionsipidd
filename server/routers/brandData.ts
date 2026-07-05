import { router, publicProcedure } from "../_core/trpc";
import {
    BRAND_COLORS,
    BRAND_TYPOGRAPHY,
    BRAND_GEOMETRY,
    LOGO_STYLES,
    INDUSTRIES,
} from "../../shared/brandData";

/**
 * Brand Data Router
 * Expone datos públicos para la interfaz de generación de marca
 * Estos datos NO requieren autenticación
 */
export const brandDataRouter = router({
    /**
     * Obtener lista de colores disponibles
     */
    getColors: publicProcedure.query(async () => {
        return BRAND_COLORS;
    }),

    /**
     * Obtener lista de tipografías disponibles
     */
    getTypography: publicProcedure.query(async () => {
        return BRAND_TYPOGRAPHY;
    }),

    /**
     * Obtener lista de geometrías disponibles
     */
    getGeometry: publicProcedure.query(async () => {
        return BRAND_GEOMETRY;
    }),

    /**
     * Obtener lista de estilos de logo disponibles
     */
    getLogoStyles: publicProcedure.query(async () => {
        return LOGO_STYLES;
    }),

    /**
     * Obtener lista de industrias disponibles
     */
    getIndustries: publicProcedure.query(async () => {
        return INDUSTRIES;
    }),

    /**
     * Obtener todos los datos en una sola llamada (optimización)
     */
    getAllData: publicProcedure.query(async () => {
        return {
            colors: BRAND_COLORS,
            typography: BRAND_TYPOGRAPHY,
            geometry: BRAND_GEOMETRY,
            logoStyles: LOGO_STYLES,
            industries: INDUSTRIES,
        };
    }),
});

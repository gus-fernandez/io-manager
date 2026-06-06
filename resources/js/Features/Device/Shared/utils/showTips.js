// @/Features/Device/Shared/utils/showTips.js

/**
 * @file showTips.js
 * @module Features/Shared/utils/showTips
 * @description Gestiona el estado global de visibilidad de los tooltips en la aplicación.
 */

/** * Configuración global para el estado de los tooltips.
 * @type {{showTooltips: boolean}} 
 */
export const globalConfig = {
    showTooltips: false
};

/**
 * Alterna el estado global de visibilidad de los tooltips.
 * Dispara un evento personalizado 'tooltips-changed' en el objeto window 
 * para notificar a cualquier componente que necesite re-renderizarse.
 * * @returns {boolean} El nuevo estado de showTooltips.
 */
export function toggleGlobalTooltips() {
    globalConfig.showTooltips = !globalConfig.showTooltips;
    window.dispatchEvent(new Event('tooltips-changed'));
    return globalConfig.showTooltips;
}
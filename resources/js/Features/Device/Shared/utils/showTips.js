// @/Features/Device/Shared/utils/showTips.js

export const globalConfig = {
    showTooltips: false
};

export function toggleGlobalTooltips() {
    globalConfig.showTooltips = !globalConfig.showTooltips;
    window.dispatchEvent(new Event('tooltips-changed'));
    return globalConfig.showTooltips;
}
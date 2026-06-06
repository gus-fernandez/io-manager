// @/Features/Device/Cloud/utils/repoUtils.js

/**
 * @file repoUtils.js
 * @module Features/Cloud/utils/repoUtils
 * @description Utilidades para la gestión de repositorios y sincronización de presets.
 * Implementa la lógica de fusión (merge) entre datos de la nube y el dispositivo,
 * además de utilidades para la gestión de slots de memoria y conversión de datos.
 */

/**
 * Fusiona presets de la nube y el dispositivo en una lista unificada.
 * Utiliza CRC y Nombre como claves de unicidad para evitar duplicados.
 * * @param {Array} privateData - Array de objetos (presets nube).
 * @param {Array} devicePresets - Array de objetos (presets hardware).
 * @returns {Array} Colección unificada con flags de estado (inCloud, inDevice).
 */
export const mergePresets = (privateData, devicePresets) => {
    const merged = [];
    const matchedDeviceIds = new Set();

    privateData.forEach(cloud => {
        const cloudCrc = cloud.crc ?? cloud.crc32;
        
        const match = devicePresets.find(d => 
            !matchedDeviceIds.has(d.id) && 
            d.crc === cloudCrc && 
            d.name.trim().toUpperCase() === cloud.name.trim().toUpperCase()
        );

        merged.push({
            key:      `cloud-${cloud.id}`,
            name:     cloud.name,
            desc:     cloud.desc,
            rating:   cloud.rating,
            cat:      cloud.cat,
            fav:      cloud.fav ?? cloud.isFav,
            cloudId:  cloud.id,
            deviceId: match?.id ?? null,
            inCloud:  true,
            inDevice: !!match,
            crc:      cloudCrc,
        });
        
        if (match) matchedDeviceIds.add(match.id);
    });

    devicePresets
        .filter(d => !matchedDeviceIds.has(d.id))
        .forEach(device => {
            merged.push({
                key:      `device-${device.id}`,
                name:     device.name,
                desc:     null,
                rating:   null,
                cat:      device.catId,
                fav:      device.isFav,
                cloudId:  null,
                deviceId: device.id,
                inCloud:  false,
                inDevice: true,
                crc:      device.crc,
            });
        });

    return merged;
};

/**
 * Determina si un preset requiere sincronización con la nube.
 * @param {object} item - Objeto de preset unificado.
 * @returns {boolean} True si el preset está en dispositivo pero no en nube.
 */
export const needsSync = (item) => !item.inCloud && item.inDevice;

/**
 * Valida si un preset es elegible para ser sincronizado.
 * Asegura que el preset no esté ya en nube y que coincida con el contexto actual.
 * @param {object} item - Objeto de preset a validar.
 * @param {object} currentPreset - Preset actualmente seleccionado en el dispositivo.
 * @returns {boolean} True si la sincronización es segura y permitida.
 */
export const canSync = (item, currentPreset) => {
    if (!currentPreset) return false;
    return !item.inCloud && item.inDevice && item.deviceId === currentPreset.id;
};

/**
 * Verifica si existe al menos un item pendiente de sincronización en el dataset.
 * @param {Array} data - Lista de presets.
 * @returns {boolean}
 */
export const hasItemsToSync = (data) => data.some(item => needsSync(item));

/**
 * Convierte una cadena hexadecimal en un Uint8Array (128 bytes).
 * Utilizado para preparar los datos binarios antes de la comunicación MIDI/Serial.
 * @param {string} hexString - Cadena hexadecimal.
 * @returns {Uint8Array}
 */
export const hexToUint8Array = (hexString) => {
    if (!hexString) return new Uint8Array(128);
    const pairs = hexString.match(/.{1,2}/g) || [];
    return new Uint8Array(pairs.map(byte => parseInt(byte, 16)));
};

/**
 * Busca el primer slot de memoria libre en el dispositivo (0-127).
 * @param {Array} devicePresets - Lista de presets presentes en el dispositivo.
 * @returns {number|null} ID del slot libre o null si la memoria está llena.
 */
export const getNextFreeSlot = (devicePresets) => {
    const occupiedSlots = new Set(devicePresets.map(p => p.id));
    for (let i = 0; i < 128; i++) {
        if (!occupiedSlots.has(i)) return i;
    }
    return null;
};
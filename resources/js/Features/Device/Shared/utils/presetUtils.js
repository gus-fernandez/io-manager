// @/Features/Device/Shared/utils/presetUtils.js

/**
 * @file presetUtils.js
 * @module Features/Shared/utils/presetUtils
 * @description Utilidades para el manejo de la estructura binaria de los presets.
 * Incluye lógica para parsear buffers recibidos del hardware a objetos JS y
 * serializar objetos JS hacia buffers binarios compatibles con la memoria del dispositivo.
 */

import { CC } from '@/Features/Device/Shared/utils/midiCC';

export const IOP_NUM = 128;
export const PRESET_META_SIZE = 21;
const NAME_SIZE = 16;

/**
 * Mapeo de offsets (posiciones en bytes) dentro de la estructura binaria de un preset completo.
 * @type {Object.<string, number>}
 */
export const Slot = {
    Header: 0,   // 2 bytes
    Id:     2,   // 1 byte
    Flags:  3,   // 1 byte
    Name:   4,   // 16 bytes
    Params: 20,  // 104 bytes
    Crc:    124  // 4 bytes
};

/**
 * Mapeo de offsets dentro de la estructura reducida de metadatos.
 * @type {Object.<string, number>}
 */
const MetaSlot = {
    Flags: 0,
    Name:  1,   // 16 bytes
    Crc:   17   // 4 bytes
};

/**
 * Máscaras de bits para decodificar el byte de flags del preset.
 * @type {Object.<string, number>}
 */
const Flag = {
    Empty:    0,
    ReadOnly: 1,
    Fav:      2,
    Exists:   3,
    Cat:      5
};

/**
 * Categorías disponibles para los presets.
 * @type {Object.<number, string>}
 */
export const Cat = {
    0: "Undef",
    1: "Lead",
    2: "Pad",
    3: "Keys",
    4: "Bass",
    5: "Arp",
    6: "Fx",
    7: "Perc"
};

/**
 * Decodifica un byte de flags en un objeto legible.
 * @param {number} flagsByte - Byte de estado del preset.
 * @returns {object} Estado booleano de las flags y ID de categoría.
 */
function parseFlags(flagsByte) {
    
    const isEmpty    = (flagsByte & (1 << Flag.Empty)) !== 0;
    const isReadOnly = (flagsByte & (1 << Flag.ReadOnly)) !== 0;
    const isFav      = (flagsByte & (1 << Flag.Fav)) !== 0;
    const exists     = (flagsByte & (1 << Flag.Exists)) !== 0;
    const catId      = (flagsByte >> Flag.Cat) & 0x07;
    const category   = Cat[catId] || "Undef";

    return {
        isEmpty,
        isReadOnly,
        isFav,
        exists,
        catId,
        category
    };
}

/**
 * Empaqueta las propiedades de un preset en un único byte de flags.
 * @param {object} preset - Objeto con las propiedades del preset.
 * @returns {number} Byte empaquetado.
 */
export function packFlags(preset) {
    
    let flagsByte = 0;
    if (preset.isEmpty) flagsByte |= (1 << Flag.Empty);
    if (preset.isReadOnly) flagsByte |= (1 << Flag.ReadOnly);
    if (preset.isFav) flagsByte |= (1 << Flag.Fav);
    if (preset.exists) flagsByte |= (1 << Flag.Exists);
    flagsByte |= ((preset.catId ?? 0) & 0x07) << Flag.Cat;
    
    return flagsByte;
}

/**
 * Convierte un arreglo de bytes en un string de nombre, eliminando caracteres nulos.
 * @param {Uint8Array} nameBytes - Buffer conteniendo el nombre.
 * @returns {string} Nombre del preset limpio.
 */
function parseName(nameBytes) {
    let name = "";
    
    for (let i = 0; i < 16; i++) {
        const byte = nameBytes[i];
        if (byte === 0) break;
        name += String.fromCharCode(byte);
    }
    
    const trimmed = name.trim();
    return trimmed === "" ? `NO NAME` : trimmed;
}

/**
 * Mapea el buffer de parámetros a un objeto JS usando las constantes MIDI CC.
 * @param {Uint8Array} rawBuffer - Buffer completo del preset.
 * @returns {object} Objeto con valores de parámetros.
 */
function parseParams(rawBuffer) {
    const mappedValues = {};
    const paramsBuffer = rawBuffer.subarray(Slot.Params, Slot.Crc);
    Object.entries(CC).forEach(([key, ccNumber]) => {
        if (ccNumber < paramsBuffer.length) {
            mappedValues[key] = paramsBuffer[ccNumber];
        }
    });

    return mappedValues;
}

/**
 * Extrae el ID del preset desde un buffer.
 * @param {Uint8Array} rawBuffer 
 * @returns {number} ID del preset.
 */
function parseId(rawBuffer) {
    return rawBuffer[Slot.Id];
}

/**
 * Devuelve el CRC32 a partir de 4 bytes.
 * @param {Uint8Array} crcBytes 
 * @returns {number} Valor CRC.
 */
function parseCrc(crcBytes) {
    return (
        (crcBytes[0] << 24) |
        (crcBytes[1] << 16) |
        (crcBytes[2] << 8) |
        crcBytes[3]
    ) >>> 0;
}

/**
 * Parsea un buffer completo a un objeto de preset detallado.
 * @param {Uint8Array} buf - Buffer binario de un preset.
 * @returns {object} Objeto preset completo.
 */
export function parseCurrentPreset(buf) {
    let currentId     = parseId(buf);
    let currentFlags  = parseFlags(buf[Slot.Flags]);
    let currentName   = parseName(buf.subarray(Slot.Name, Slot.Name + NAME_SIZE));
    let currentParams = parseParams(buf);
    let currentCrc    = parseCrc(buf.subarray(Slot.Crc, Slot.Crc + 4));
    
    return {
        id: currentId,
        name: currentName,
        crc: currentCrc,
        params: currentParams,
        ...currentFlags
    };
}

/**
 * Parsea un buffer de metadatos (lista de presets) en una colección.
 * @param {Uint8Array} rawBuffer - Buffer conteniendo toda la metadata.
 * @returns {Array<Object>} Lista de objetos de metadatos de presets.
 */
export function parseMetadata(rawBuffer) {
    const presets = [];

    for (let i = 0; i < IOP_NUM; i++) {
        const offset = i * PRESET_META_SIZE;

        let currentFlags = parseFlags(rawBuffer[offset + MetaSlot.Flags]);
        let currentName  = parseName(rawBuffer.subarray(offset + MetaSlot.Name, offset + MetaSlot.Name + NAME_SIZE));
        
        //DEBUG
        //let check = rawBuffer.subarray(offset + MetaSlot.Name, offset + MetaSlot.Name + NAME_SIZE);
        //const decoder = new TextDecoder('utf-8');
        //console.log("Bytes:", check);
        //console.log("Buffer:", decoder.decode(check));
        //console.log(currentName);
        
        let currentCrc   = parseCrc(rawBuffer.subarray(offset + MetaSlot.Crc, offset + MetaSlot.Crc + 4));

        presets.push({
            id: i,
            name: currentName,
            crc: currentCrc,
            ...currentFlags
        });
    }
    return presets;
}

/**
 * Prepara un objeto preset para ser enviado a la base de datos.
 * @param {object} preset - Objeto del preset a serializar.
 * @returns {object} Contiene el buffer binario y los campos formateados para la BD.
 */
export function packPresetForBD(preset) {

    // --- Binario ---
    const buffer = new Uint8Array(128);

    // Header: "IO"
    buffer[Slot.Header]     = 0x49; // 'I'
    buffer[Slot.Header + 1] = 0x4F; // 'O'

    // Id: 255 (pending relocation)
    buffer[Slot.Id] = 0xFF;

    // Flags
    const isFavorite = preset.isFav ?? preset.fav ?? false;
    const uploadFlags = {
        isEmpty:    false,
        isReadOnly: preset.isReadOnly,
        isFav:      isFavorite,
        exists:     true,
        catId:      preset.catId ?? 0,
    };
    buffer[Slot.Flags] = packFlags(uploadFlags);

    // Name (16 bytes, null-padded)
    const nameBytes = new Uint8Array(16).fill(0x20);
    for (let i = 0; i < Math.min(preset.name.length, 16); i++) {
        nameBytes[i] = preset.name.charCodeAt(i);
    }
    buffer.set(nameBytes, Slot.Name);

    // Params (104 bytes, mapped por CC number)
    const paramsBuffer = new Uint8Array(104);
    Object.entries(CC).forEach(([key, ccNumber]) => {
        if (preset.params?.[key] !== undefined && ccNumber < 104) {
            paramsBuffer[ccNumber] = preset.params[key];
        }
    });
    buffer.set(paramsBuffer, Slot.Params);

    // CRC (el que viene de la placa)
    buffer[Slot.Crc]     = (preset.crc >>> 24) & 0xFF;
    buffer[Slot.Crc + 1] = (preset.crc >>> 16) & 0xFF;
    buffer[Slot.Crc + 2] = (preset.crc >>> 8)  & 0xFF;
    buffer[Slot.Crc + 3] =  preset.crc         & 0xFF;

    // Campos BD
    const dbFields = {
        name:   preset.name,
        fav:    isFavorite,
        cat:    preset.catId  ?? 0,
        crc32:  preset.crc,
        desc:   preset.desc   ?? null,
        params: Array.from(buffer)
                .map(b => b.toString(16).padStart(2, '0'))
                .join(''),
    };

    return { buffer, dbFields };
}
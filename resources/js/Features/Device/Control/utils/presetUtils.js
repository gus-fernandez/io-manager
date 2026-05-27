// @/Features/Device/Control/utils/presetUtils.js

import { CC } from '@/Features/Device/Control/utils/midiCC';

export const IOP_NUM = 128;
export const PRESET_META_SIZE = 17;

const Slot = {
    Header: 0,   // 2 bytes
    Id:     2,   // 1 byte
    Flags:  3,   // 1 byte
    Name:   4,   // 16 bytes
    Params: 20,  // 106 bytes
    Crc:    126  // 2 bytes
};

const Flag = {
    Empty:    0,
    ReadOnly: 1,
    Fav:      2,
    Exists:   3,
    Cat:      5
};

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

function extractFlags(flagsByte) {
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

export function packFlags(preset) {
    if (!preset) return 0;
    
    let flagsByte = 0;
    if (preset.isEmpty)    flagsByte |= (1 << Flag.Empty);
    if (preset.isReadOnly) flagsByte |= (1 << Flag.ReadOnly);
    if (preset.isFav)      flagsByte |= (1 << Flag.Fav);
    if (preset.exists)     flagsByte |= (1 << Flag.Exists);
    flagsByte |= ((preset.catId ?? 0) & 0x07) << Flag.Cat;
    
    return flagsByte;
}

function extractName(nameBytes) {
    let name = "";
    for (let i = 0; i < nameBytes.length; i++) {
        if (nameBytes[i] === 0) break;
        name += String.fromCharCode(nameBytes[i]);
    }
    const trimmed = name.trim();
    if (trimmed === "") return `NO NAME`;
    return `${trimmed}`;
}

export function parseMetadata(rawBuffer) {
    const presets = [];
    for (let i = 0; i < IOP_NUM; i++) {
        const offset    = i * PRESET_META_SIZE;
        const flagsByte = rawBuffer[offset];
        const flags     = extractFlags(flagsByte);
        const nameBytes = rawBuffer.subarray(offset + 1, offset + PRESET_META_SIZE);
        const name      = extractName(nameBytes, i, flags.isEmpty);
        presets.push({ id: i, name, ...flags });
    }
    return presets;
}

export function parsePresetParams(rawBuffer) {
    const mappedValues = {};
    const paramsBuffer = rawBuffer.subarray(Slot.Params, Slot.Crc);
    Object.entries(CC).forEach(([key, ccNumber]) => {
        if (ccNumber < paramsBuffer.length) {
            mappedValues[key] = paramsBuffer[ccNumber];
        }
    });

    return mappedValues;
}

export function parseCurrentId(rawBuffer) {
    return rawBuffer[Slot.Id];
}
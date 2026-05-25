// @js/Features/Device/presetUtils.js

import { CC } from '@/Features/Device/Modules/midiCC';

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

const Cat = {
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

function extractName(nameBytes, presetIndex, isEmpty = false) {
    if (isEmpty) {
        return `Preset ${String(presetIndex).padStart(3, '0')}`;
    }

    let name = "";
    for (let i = 0; i < nameBytes.length; i++) {
        if (nameBytes[i] === 0) break;
        name += String.fromCharCode(nameBytes[i]);
    }

    const trimmed = name.trim();
    return trimmed === "" ? `Preset ${String(presetIndex).padStart(3, '0')}` : trimmed;
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
// @/Features/Device/Shared/utils/presetUtils.js

import { CC } from '@/Features/Device/Shared/utils/midiCC';

export const IOP_NUM = 128;
export const PRESET_META_SIZE = 21;
const NAME_SIZE = 16;

const Slot = {
    Header: 0,   // 2 bytes
    Id:     2,   // 1 byte
    Flags:  3,   // 1 byte
    Name:   4,   // 16 bytes
    Params: 20,  // 104 bytes
    Crc:    124  // 4 bytes
};

const MetaSlot = {
    Flags: 0,
    Name:  1,   // 16 bytes
    Crc:   17   // 4 bytes
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

export function packFlags(preset) {
    
    let flagsByte = 0;
    if (preset.isEmpty) flagsByte |= (1 << Flag.Empty);
    if (preset.isReadOnly) flagsByte |= (1 << Flag.ReadOnly);
    if (preset.isFav) flagsByte |= (1 << Flag.Fav);
    if (preset.exists) flagsByte |= (1 << Flag.Exists);
    flagsByte |= ((preset.catId ?? 0) & 0x07) << Flag.Cat;
    
    return flagsByte;
}

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

function parseId(rawBuffer) {
    return rawBuffer[Slot.Id];
}

function parseCrc(crcBytes) {
    return (
        (crcBytes[0] << 24) |
        (crcBytes[1] << 16) |
        (crcBytes[2] << 8) |
        crcBytes[3]
    ) >>> 0;
}

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

export function parseMetadata(rawBuffer) {
    const presets = [];

    for (let i = 0; i < IOP_NUM; i++) {
        const offset = i * PRESET_META_SIZE;

        let currentFlags = parseFlags(rawBuffer[offset + MetaSlot.Flags]);
        let currentName  = parseName(rawBuffer.subarray(offset + MetaSlot.Name, offset + MetaSlot.Name + NAME_SIZE));
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
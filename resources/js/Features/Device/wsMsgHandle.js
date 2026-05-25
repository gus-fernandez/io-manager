// @resources/js/Features/Device/wsMsgHandle.js

import { parseMetadata, parsePresetParams, parseCurrentId, IOP_NUM, PRESET_META_SIZE } from '@/Features/Device/presetUtils';

const MSG_HEARTBEAT   = 0xFF;
const MSG_DATA        = 0xFC;
const MSG_LOAD        = 0xFB;
const MSG_SAVE        = 0xFA;

const EXPECTED_META   = IOP_NUM * PRESET_META_SIZE; // 2176 bytes
const EXPECTED_PRESET = 128;
const TOTAL_RAW_DATA  = EXPECTED_META + EXPECTED_PRESET; // 2304 bytes

let rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
let totalBytesReceived = 0;

let presetBuffer = new Uint8Array(EXPECTED_PRESET);
let presetBytesReceived = 0;

export function resetDataStream() {
    totalBytesReceived = 0;
    presetBytesReceived = 0;
    rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
    presetBuffer = new Uint8Array(EXPECTED_PRESET);
}

export function handleMsg(event, wsState) {
    if (!(event.data instanceof ArrayBuffer)) return;

    const buffer = event.data;
    const view = new DataView(buffer);
    const opcode = view.getUint8(0);

    switch (opcode) {
        case MSG_HEARTBEAT:
            break;

        case MSG_DATA:
            processDataStream(buffer, wsState);
            break;
        
        case MSG_LOAD:
            console.log("Entrando en Load");
            processPresetStream(buffer, wsState);
            break;

        default:
            console.warn(`Unknown opcode: 0x${opcode.toString(16).toUpperCase()}`);
    }
}

function processDataStream(buffer, wsState) {
    const chunkData = new Uint8Array(buffer, 1); // Saltamos opcode
    const remainingBytes = TOTAL_RAW_DATA - totalBytesReceived;
    const bytesToCopy = Math.min(chunkData.length, remainingBytes);

    rawDataBuffer.set(chunkData.subarray(0, bytesToCopy), totalBytesReceived);
    totalBytesReceived += bytesToCopy;

    if (totalBytesReceived >= TOTAL_RAW_DATA) {
        const cleanMetaBuffer = new Uint8Array(rawDataBuffer.buffer, 0, EXPECTED_META);
        const cleanPresetBuffer = new Uint8Array(rawDataBuffer.buffer, EXPECTED_META, EXPECTED_PRESET);
        
        parseMeta(cleanMetaBuffer, wsState);
        parsePreset(cleanPresetBuffer, wsState, true);

        resetDataStream();
    }
}

function processPresetStream(buffer, wsState) {
    const chunkData = new Uint8Array(buffer, 1);
    const remainingBytes = EXPECTED_PRESET - presetBytesReceived;
    const bytesToCopy = Math.min(chunkData.length, remainingBytes);

    presetBuffer.set(chunkData.subarray(0, bytesToCopy), presetBytesReceived);
    presetBytesReceived += bytesToCopy;

    if (presetBytesReceived >= EXPECTED_PRESET) {
        parsePreset(presetBuffer, wsState, false);
        
        presetBytesReceived = 0;
        presetBuffer = new Uint8Array(EXPECTED_PRESET);
    }
}


function parseMeta(metaBuf, wsState) {
    const metadata = parseMetadata(metaBuf);
    console.log("Metadata Parse: Ok");
    wsState.tempMetadata = metadata; 
}

function parsePreset(presetBuf, wsState, isInitStream) {
    const currentId = parseCurrentId(presetBuf);
    const presetParams = parsePresetParams(presetBuf);
    
    if (isInitStream) {
        console.log("Init Stream Completo: Ok");
        wsState.onParsed?.({ 
            metadata: wsState.tempMetadata || null, 
            currentId, 
            presetParams 
        });
        delete wsState.tempMetadata;
    } else {
        console.log("Load Preset Stream: Ok");
        wsState.onParsed?.({ 
            metadata: null,
            currentId, 
            presetParams 
        });
    }
}

export function sendSavePacket(sendFn, name, flags = 0) {
    if (!sendFn) return;

    const finalName = name.toUpperCase().padEnd(16, ' ').substring(0, 16);
    const encoder = new TextEncoder();
    const nameBytes = encoder.encode(finalName);

    const payload = new Uint8Array(18);
    payload[0] = MSG_SAVE;
    payload.set(nameBytes, 1);
    payload[17] = flags;

    sendFn(payload.buffer);
}

export function sendLoadPacket(sendFn, presetId) {
    if (!sendFn) return;

    const payload = new Uint8Array([MSG_LOAD, presetId]);
    sendFn(payload.buffer);
}
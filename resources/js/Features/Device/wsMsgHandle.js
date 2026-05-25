// @resources/js/Features/Device/wsMsgHandle.js

import { parseMetadata, parsePresetParams, parseCurrentId, IOP_NUM, PRESET_META_SIZE } from '@/Features/Device/presetUtils';

const MSG_HEARTBEAT   = 0xFF;
const MSG_DATA        = 0xFC;

const MSG_ESP32_READY = 0xFE;
const MSG_PRESET      = 0xFB;
const MSG_SAVE        = 0xFA;

const EXPECTED_META   = IOP_NUM * PRESET_META_SIZE; // 2176 bytes
const EXPECTED_PRESET = 128;
const TOTAL_RAW_DATA  = EXPECTED_META + EXPECTED_PRESET; // 2304 bytes

let rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
let totalBytesReceived = 0;

export function resetDataStream() {
    totalBytesReceived = 0;
    rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
}

export function handleMsg(event, wsState) {
    if (!(event.data instanceof ArrayBuffer)) return;

    const buffer = event.data;
    if (buffer.byteLength !== 32) return; 

    const view = new DataView(buffer);
    const opcode = view.getUint8(0);

    switch (opcode) {
        case MSG_HEARTBEAT:
            break;

        case MSG_DATA:
            processDataStream(buffer, wsState);

        break;

        default:
            console.warn(`Unknown opcode: 0x${opcode.toString(16).toUpperCase()}`);
    }
}

function processDataStream(buffer, wsState) {

    //const full = new Uint8Array(buffer);
    //const hex = Array.from(full).map(b => b.toString(16).padStart(2, '0')).join(' ');
    //console.log(`Pkt #${Math.floor(totalBytesReceived/31)} | offset: ${totalBytesReceived} | ${hex}`);
    const chunkData = new Uint8Array(buffer, 1, 31);
    const remainingBytes = TOTAL_RAW_DATA - totalBytesReceived;
    const bytesToCopy = Math.min(chunkData.length, remainingBytes);

    rawDataBuffer.set(chunkData.subarray(0, bytesToCopy), totalBytesReceived);
    totalBytesReceived += bytesToCopy;

    if (totalBytesReceived >= TOTAL_RAW_DATA) {
        parseBuffer(rawDataBuffer.buffer, wsState);
        totalBytesReceived = 0;
        rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
    }
}

function parseBuffer(fullBuffer, wsState) {
    const cleanMetaBuffer = new Uint8Array(fullBuffer, 0, EXPECTED_META);
    const cleanPresetBuffer = new Uint8Array(fullBuffer, EXPECTED_META, EXPECTED_PRESET);
    const metadata = parseMetadata(cleanMetaBuffer);
    const currentId = parseCurrentId(cleanPresetBuffer);
    const presetParams = parsePresetParams(cleanPresetBuffer);
    console.log("Init: Ok");
    wsState.onParsed?.({ metadata, currentId, presetParams });
}


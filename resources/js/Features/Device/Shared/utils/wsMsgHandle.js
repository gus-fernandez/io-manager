// @/Features/Device/Shared/utils/wsMsgHandle.js

/**
 * @file wsMsgHandle.jsç
 * @module Features/Shared/utils/wsMsgHandle
 * @description Manejador de comunicaciones WebSocket para la interacción con el hardware.
 * Procesa opcodes para la sincronización de presets, carga de datos y streaming.
 * Gestiona buffers internos para reensamblar mensajes fragmentados recibidos en chunks.
 */

import {
    parseMetadata,
    parseCurrentPreset,
    IOP_NUM,
    PRESET_META_SIZE
} from '@/Features/Device/Shared/utils/presetUtils.js';

const MSG_HEARTBEAT   = 0xFF;
const MSG_DELETE      = 0xFE;
const MSG_UPLOAD      = 0xFD;
const MSG_DATA        = 0xFC;
const MSG_LOAD        = 0xFB;
const MSG_SAVE        = 0xFA;

const EXPECTED_META   = IOP_NUM * PRESET_META_SIZE; // 2688 bytes
const PADDING         = 9;
const EXPECTED_PRESET = 128;
const PRESET_OFFSET   = EXPECTED_META + PADDING;
const TOTAL_RAW_DATA  = PRESET_OFFSET + EXPECTED_PRESET; 

const PAYLOAD_SIZE    = 31; // Chunk Size 31 + header

let rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
let totalBytesReceived = 0;

let presetBuffer = new Uint8Array(EXPECTED_PRESET);
let presetBytesReceived = 0;

let uploadBuffer = null;
let uploadOffset = 0;
let cachedSendFn = null;
let cachedWsState = null;

/**
 * Reinicia los buffers de recepción para limpiar el estado de la comunicación.
 */
export function resetDataStream() {
    totalBytesReceived = 0;
    presetBytesReceived = 0;
    rawDataBuffer = new Uint8Array(TOTAL_RAW_DATA);
    presetBuffer = new Uint8Array(EXPECTED_PRESET);
}

/**
 * Manejador principal de mensajes WebSocket.
 * @param {MessageEvent} event - Evento de recepción del WebSocket.
 * @param {object} wsState - Estado del contexto WebSocket para actualizar la UI.
 */
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
            processPresetStream(buffer, wsState);
            break;
        
        case MSG_SAVE: // Confirmación ESP32
            wsState.setIsSaving(false);
            wsState.triggerAfterSave?.();
            console.log("Preset saved");
            break;
        
        case MSG_DELETE: // Confirmación ESP32
            wsState.setIsSaving(false);
            wsState.triggerAfterSave?.();
            console.log("Preset Deleted");
            break;

        case MSG_UPLOAD:
            sendNextChunk();
            break;
        
        default:
            console.warn(`Unknown opcode: 0x${opcode.toString(16).toUpperCase()}`);
    }
}

/**
 * Procesa el stream de datos completo (Metadata + Preset actual).
 * Reensambla los chunks hasta completar el buffer total.
 */
function processDataStream(buffer, wsState) {
    const chunkData = new Uint8Array(buffer, 1);
    const remainingBytes = TOTAL_RAW_DATA - totalBytesReceived;
    const bytesToCopy = Math.min(chunkData.length, remainingBytes);

    rawDataBuffer.set(chunkData.subarray(0, bytesToCopy), totalBytesReceived);
    totalBytesReceived += bytesToCopy;

    if (totalBytesReceived >= TOTAL_RAW_DATA) {
        const cleanMetaBuffer = new Uint8Array(rawDataBuffer.buffer, 0, EXPECTED_META);
        const cleanPresetBuffer = new Uint8Array(rawDataBuffer.buffer, PRESET_OFFSET, EXPECTED_PRESET);
        
        parseMeta(cleanMetaBuffer, wsState);
        parsePreset(cleanPresetBuffer, wsState, true);

        resetDataStream();
    }
}

/**
 * Procesa el stream de un preset individual (carga específica).
 */
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

/**
 * Parsea y registra la metadata global.
 */
function parseMeta(metaBuf, wsState) {
    const metadata = parseMetadata(metaBuf);
    console.log("Metadata Parse: Ok");
    wsState.tempMetadata = metadata;
}

/**
 * Parsea un preset y actualiza el estado de la aplicación.
 * @param {Uint8Array} presetBuf - Buffer del preset.
 * @param {object} wsState - Estado global.
 * @param {boolean} isInitStream - Indica si es la carga inicial de datos.
 */
function parsePreset(presetBuf, wsState, isInitStream) {
    const preset = parseCurrentPreset(presetBuf);
    
    if (isInitStream) {
        console.log("Init Stream: Ok");
        wsState.onParsed?.({ 
            metadata: wsState.tempMetadata || null,
            ...preset
        });
        delete wsState.tempMetadata;
    } else {
        console.log("Load Preset: Ok");
        wsState.onParsed?.({ 
            metadata: null,
            ...preset
        });
    }
}

/**
 * Envía una solicitud de guardado al hardware.
 * @param {Function} sendFn - Función de envío WebSocket.
 * @param {string} name - Nombre del preset.
 * @param {number} [flags=0] - Flags del preset.
 */
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

/**
 * Envía una solicitud de carga de preset al hardware por ID.
 */
export function sendLoadPacket(sendFn, presetId) {
    if (!sendFn) return;
    const payload = new Uint8Array([MSG_LOAD, presetId]);
    sendFn(payload.buffer);
}

/**
 * Envía una solicitud de borrado al hardware.
 */
export function sendDeletePacket(sendFn, presetId) {
    if (!sendFn) return;
    const payload = new Uint8Array([MSG_DELETE, presetId]);
    sendFn(payload.buffer);
}

/**
 * Inicia el proceso de carga de un preset hacia el hardware mediante chunking.
 * @param {Function} sendFn 
 * @param {Uint8Array} presetBuffer 
 * @param {object} wsState 
 */
export function sendPreset(sendFn, presetBuffer, wsState) {
    if (!sendFn || !(presetBuffer instanceof Uint8Array)) return;

    uploadBuffer = presetBuffer;
    uploadOffset = 0;
    cachedSendFn = sendFn;
    cachedWsState = wsState;
    wsState.setIsUploading?.(true);

    sendNextChunk();
}

/**
 * Envía el siguiente fragmento del preset. Lógica recursiva controlada por opcode.
 */
function sendNextChunk() {

    if (!uploadBuffer || uploadOffset >= uploadBuffer.length) {
        cachedWsState?.setIsUploading?.(false);
        uploadBuffer = null;
        uploadOffset = 0;
        cachedSendFn = null;
        cachedWsState = null;
        console.log("Preset Uploaded!");
        return;
    }

    const limit = Math.min(uploadOffset + PAYLOAD_SIZE, uploadBuffer.length);
    const chunkPayload = uploadBuffer.subarray(uploadOffset, limit);
    
    const packet = new Uint8Array(chunkPayload.length + 1);
    packet[0] = MSG_UPLOAD;
    packet.set(chunkPayload, 1);
    
    cachedSendFn(packet.buffer);
    uploadOffset += chunkPayload.length;
}
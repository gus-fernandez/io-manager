// @/Features/Device/Firmware/utils/serialUtils.js

/**
 * @file serialUtils.js
 * @module Features/Firmware/utils/serialUtils
 * @description Capa de comunicación serial (Bridge) entre la aplicación y el firmware.
 * Implementa el protocolo de framing para la transmisión de paquetes binarios,
 * la lógica de encriptación simple (XOR) para credenciales y la máquina de estados
 * para la configuración de redes WiFi.
 */

export const WIFI_OP_CODE = 0xFE;
export const START_PROTOCOL = 0xFD;

/** @enum {number} */
export const WifiStates = {
    NEW_WIFI_SKIP:      0x00,
    NEW_WIFI_START:     0x01,
    WAITING_FOR_SSID:   0x02,
    WAITING_FOR_PASS:   0x03,
    NEW_WIFI_TRY:       0x04,
    NEW_WIFI_FAIL:      0x05,
    NEW_WIFI_CANCEL:    0x06,
    ERASE_CREDENTIALS:  0x07,
};

export const SerialProtocol = {
    
    /**
     * Parsea un buffer binario buscando marcadores de inicio y fin para extraer un paquete.
     * @param {Uint8Array} buffer - Buffer de bytes recibido del puerto serial.
     * @returns {{buffer: Uint8Array, packet: Object|null}} El buffer restante y el paquete extraído si existe.
     */
    binReceive: (buffer) => {
        const START_MARKER = new Uint8Array([0x23, 0x23, 0x23, 0x53, 0x54, 0x41, 0x52, 0x54, 0x23, 0x23, 0x23]);
        const END_MARKER = new Uint8Array([0x23, 0x23, 0x23, 0x45, 0x4E, 0x44, 0x23, 0x23, 0x23]);

        const matchMarker = (buf, marker, offset) => {
            if (offset + marker.length > buf.length) return false;
            for (let i = 0; i < marker.length; i++) {
                if (buf[offset + i] !== marker[i]) return false;
            }
            return true;
        };

        let startIdx = -1;
        for (let i = 0; i <= buffer.length - START_MARKER.length; i++) {
            if (matchMarker(buffer, START_MARKER, i)) {
                startIdx = i;
                break;
            }
        }

        if (startIdx === -1) return { buffer: buffer, packet: null };

        let endIdx = -1;
        const searchFrom = startIdx + START_MARKER.length;
        for (let i = searchFrom; i <= buffer.length - END_MARKER.length; i++) {
            if (matchMarker(buffer, END_MARKER, i)) {
                endIdx = i;
                break;
            }
        }

        if (endIdx === -1) return { buffer: buffer, packet: null };

        const packetData = buffer.subarray(searchFrom, endIdx);
        const nextBuffer = buffer.subarray(endIdx + END_MARKER.length);

        return {
            buffer: nextBuffer,
            packet: {
                opCode: packetData[0],
                state: packetData[1],
                payload: packetData.subarray(2)
            }
        };
    },

    /**
     * Construye un paquete binario listo para enviar al firmware.
     * @param {number} opCode - Código de operación del protocolo.
     * @param {Array<number>} payloadBytes - Datos adicionales.
     * @returns {Uint8Array} Paquete serializado.
     */
    binSend: (opCode, payloadBytes = []) => {
        const packet = new Uint8Array(1 + payloadBytes.length);
        packet[0] = opCode;
        packet.set(payloadBytes, 1);
        return packet;
    },

    /**
     * Interpreta comandos de texto y los traduce a operaciones del protocolo serial
     * basadas en el estado actual de la máquina de estados WiFi.
     * @param {string} command - Comando enviado por el usuario.
     * @param {number} currentState - Estado actual de la máquina de estados.
     * @param {Uint8Array} xorKey - Llave para encriptación XOR.
     * @param {number} netWorkNum - Cantidad de redes disponibles.
     * @returns {Uint8Array|null} Paquete resultante o null si no se reconoce.
     */
    handleCommand: (
        command,
        currentState,
        xorKey,
        netWorkNum
    ) => {
        const rawCmd = command.trim();
        const cmd = rawCmd.toLowerCase();

        if (cmd === 'cancel') return SerialProtocol.cancelWifi();
        if (cmd === 'exit') return SerialProtocol.cancelWifi();
        if (cmd === 'wifi') return SerialProtocol.newWifiStart();
        if (cmd === 'start') return SerialProtocol.newWifiStart();
        if (cmd === 'erase') return SerialProtocol.eraseCreds();
        if (cmd === 'delete') return SerialProtocol.eraseCreds();

        console.log(`[DEBUG] Cmd: "${cmd}" | Estado: ${currentState} | NetWorks: ${netWorkNum}`);

        switch (currentState) {
            case WifiStates.NEW_WIFI_SKIP: break;                
            case WifiStates.WAITING_FOR_SSID: {
                const index = parseInt(cmd, 10) - 1;
                if (!isNaN(index) && index >= 0 && index < netWorkNum) {
                    return SerialProtocol.selectSsid(index);
                }
                break;
            }
            case WifiStates.WAITING_FOR_PASS:
                if (xorKey && xorKey.length > 0) {
                    const passBytes = new TextEncoder().encode(rawCmd);
                    const encryptedBytes = passBytes.map((byte, i) => byte ^ xorKey[i % xorKey.length]);
                    return SerialProtocol.sendPassword([passBytes.length, ...Array.from(encryptedBytes)]);
                }
                break;

            case WifiStates.NEW_WIFI_FAIL: break;
            case WifiStates.NEW_WIFI_TRY: break;
            case WifiStates.NEW_WIFI_CANCEL: break;
        }

        return null;
    },

    newWifiStart: () => {
        return SerialProtocol.binSend(WIFI_OP_CODE, [WifiStates.NEW_WIFI_START]);
    },

    selectSsid: (index) => {
        return SerialProtocol.binSend(WIFI_OP_CODE, [WifiStates.WAITING_FOR_SSID, index]);
    },

    sendPassword: (password) => {
        return SerialProtocol.binSend(WIFI_OP_CODE, [WifiStates.WAITING_FOR_PASS, ...password]);
    },

    cancelWifi: () => {
        return SerialProtocol.binSend(WIFI_OP_CODE, [WifiStates.NEW_WIFI_CANCEL]);
    },

    eraseCreds: () => {
        return SerialProtocol.binSend(WIFI_OP_CODE, [WifiStates.ERASE_CREDENTIALS]);
    },
};
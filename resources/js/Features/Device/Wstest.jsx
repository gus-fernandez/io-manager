// resources/js/Features/Device/WsTest.jsx
import { useState, useRef, useEffect } from 'react';

const ESP32_IP = '192.168.8.132';
const WS_URL = `ws://${ESP32_IP}/ws`;

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;
const A4 = 69;
const VELOCITY = 100;
const MSG_AUTH = 0xFF;   // debe coincidir con el #define en ws_receiver.h

export default function WsTest() {
    const ws = useRef(null);
    const [status, setStatus] = useState('Desconectado');
    const [testing, setTesting] = useState(false);
    const [log, setLog] = useState([]);

    const appendLog = (msg) =>
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
    /*
    useEffect(() => {
        connect();
        return () => ws.current?.close();
    }, []);
    */
    const connectingRef = useRef(false);

    const connect = async () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;
        if (connectingRef.current) return;  // ← evita doble conexión
        connectingRef.current = true;

        setStatus('Conectando...');

        // 1. Obtener token primero
        let token = null;
        try {
            const res  = await fetch('/api/ws-token');
            const data = await res.json();
            token = data.token;
        } catch {
            appendLog('Error al obtener token de Laravel');
            setStatus('Error');
            connectingRef.current = false;
            return;
        }

        // 2. Crear socket solo cuando el token ya existe
        const socket = new WebSocket(WS_URL);
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            connectingRef.current = false;
            console.log('onopen fired, token:', token);
            console.log('socket state:', socket.readyState);
            appendLog('Conectado, autenticando...');

            const tokenBytes = new TextEncoder().encode(token); // token garantizado aquí
            const msg = new Uint8Array(2 + tokenBytes.length);
            msg[0] = MSG_AUTH;
            msg[1] = tokenBytes.length;
            msg.set(tokenBytes, 2);
            socket.send(msg.buffer);

            appendLog(`TX AUTH: [0xFF, ${tokenBytes.length}, ...token...]`);
        };

        socket.onclose = () => {
            connectingRef.current = false;
            setStatus('Desconectado');
            appendLog('WebSocket desconectado');
        };

        socket.onerror = () => {
            connectingRef.current = false;
            setStatus('Error');
            appendLog('Error de conexión');
        };

        socket.onmessage = (e) => {
            const data = new Uint8Array(e.data);

            // Primer mensaje tras auth: [0xFF, 0x01] = auth OK
            if (data[0] === MSG_AUTH && data[1] === 0x01) {
                setStatus('Autenticado');
                appendLog('Auth OK');
                return;
            }

            appendLog(`RX: [${Array.from(data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
        };

        ws.current = socket;
    };

    const send = (bytes) => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
            appendLog('Sin conexión');
            return false;
        }
        ws.current.send(new Uint8Array(bytes).buffer);
        return true;
    };

    const disconnect = () => {
        ws.current?.close();
        ws.current = null;
        setStatus('Desconectado');
        appendLog('Desconectado manualmente');
    };

    const testNote = async () => {
        if (testing) return;
        setTesting(true);

        if (send([NOTE_ON, A4, VELOCITY])) {
            appendLog(`TX NOTE ON  — note: ${A4} (A4), vel: ${VELOCITY}`);
        }

        await new Promise(r => setTimeout(r, 1000));

        if (send([NOTE_OFF, A4, 0x00])) {
            appendLog(`TX NOTE OFF — note: ${A4} (A4)`);
        }

        setTesting(false);
    };

    const statusColor = {
        'Autenticado': '#0f0',
        'Conectado': '#ff0',
        'Error': 'red',
    }[status] ?? '#aaa';

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <h3>WebSocket Test</h3>

            <div style={{ marginBottom: '12px' }}>
                <span>Estado: </span>
                <strong style={{ color: statusColor }}>{status}</strong>
                {status === 'Desconectado' || status === 'Error' ? (
                    <button onClick={connect} style={{ marginLeft: '12px' }}>
                        Conectar
                    </button>
                ) : (
                    <button onClick={disconnect} style={{ marginLeft: '12px' }}>
                        Desconectar
                    </button>
                )}
            </div>

            <button
                onClick={testNote}
                disabled={status !== 'Autenticado' || testing}
                style={{ marginBottom: '12px' }}
            >
                {testing ? 'Enviando...' : '▶ Test A4 (Note On → 1s → Note Off)'}
            </button>

            <div style={{
                height: '180px', overflowY: 'auto',
                background: '#000', color: '#0f0',
                padding: '8px', fontSize: '12px',
            }}>
                {log.length === 0
                    ? <span style={{ color: '#555' }}>Sin actividad</span>
                    : log.map((line, i) => <div key={i}>{line}</div>)
                }
            </div>
        </div>
    );
}
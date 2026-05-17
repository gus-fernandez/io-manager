// resources/js/Features/Device/WsTest.jsx
import { useState, useRef, useEffect } from 'react';

const ESP32_IP = '192.168.8.132';
const WS_URL   = `ws://${ESP32_IP}/ws`;

// MIDI
const NOTE_ON  = 0x90;
const NOTE_OFF = 0x80;
const A4       = 69;   // MIDI note 69 = A4
const VELOCITY = 100;

export default function WsTest() {
    const ws          = useRef(null);
    const [status, setStatus] = useState('Desconectado');
    const [log, setLog]       = useState([]);

    const appendLog = (msg) =>
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);

    // ── Conectar al montar ────────────────────────────────────────────────────
    useEffect(() => {
        connect();
        return () => ws.current?.close();
    }, []);

    const connect = () => {
        if (ws.current?.readyState === WebSocket.OPEN) return;

        setStatus('Conectando...');
        const socket = new WebSocket(WS_URL);
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            setStatus('Conectado');
            appendLog('WebSocket conectado');
        };
        socket.onclose = () => {
            setStatus('Desconectado');
            appendLog('WebSocket desconectado');
        };
        socket.onerror = () => {
            setStatus('Error');
            appendLog('Error de conexión');
        };
        socket.onmessage = (e) => {
            const data = new Uint8Array(e.data);
            appendLog(`RX: [${Array.from(data).map(b => '0x' + b.toString(16).padStart(2,'0')).join(', ')}]`);
        };

        ws.current = socket;
    };

    // ── Enviar mensaje binario ────────────────────────────────────────────────
    const send = (bytes) => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
            appendLog('Sin conexión');
            return false;
        }
        ws.current.send(new Uint8Array(bytes).buffer);
        return true;
    };

    // ── Test nota A4 ──────────────────────────────────────────────────────────
    const [testing, setTesting] = useState(false);

    const testNote = async () => {
        if (testing) return;
        setTesting(true);

        const noteOn = [NOTE_ON, A4, VELOCITY];
        if (send(noteOn)) {
            appendLog(`TX NOTE ON  — note: ${A4} (A4), vel: ${VELOCITY}`);
        }

        await new Promise(r => setTimeout(r, 1000));

        const noteOff = [NOTE_OFF, A4, 0x00];
        if (send(noteOff)) {
            appendLog(`TX NOTE OFF — note: ${A4} (A4)`);
        }

        setTesting(false);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const statusColor = { Conectado: '#0f0', Error: 'red' }[status] ?? '#aaa';

    return (
        <div style={{ fontFamily: 'monospace' }}>
            <h3>WebSocket Test</h3>

            <div style={{ marginBottom: '12px' }}>
                <span>Estado: </span>
                <strong style={{ color: statusColor }}>{status}</strong>
                {status !== 'Conectado' && (
                    <button onClick={connect} style={{ marginLeft: '12px' }}>
                        Reconectar
                    </button>
                )}
            </div>

            <button
                onClick={testNote}
                disabled={status !== 'Conectado' || testing}
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
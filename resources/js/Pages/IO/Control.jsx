// resources/js/Pages/IO/Control.jsx
import AppLayout from '@/Layouts/AppLayout';
import useWebSocket from '@/Features/Device/useWebSocket';
import WsConnection from '@/Features/Device/WebSockets';
import VirtualKeyboard from '@/Features/Device/VirtualKeyboard';
import ControlPanel from '@/Features/Device/ControlPanel';

export default function Control() {
    const ws = useWebSocket();

    return (
        <AppLayout>
            <h1>IO Control</h1>
            <WsConnection ws={ws}>

                <ControlPanel 
                    send={ws.send} 
                    appendLog={ws.appendLog} 
                    isAuthenticated={ws.status === 'Autenticado'} 
                />
            </WsConnection>
            <VirtualKeyboard 
                send={ws.send} 
                appendLog={ws.appendLog} 
                isAuthenticated={ws.status === 'Autenticado'} 
            />
        </AppLayout>
    );
}
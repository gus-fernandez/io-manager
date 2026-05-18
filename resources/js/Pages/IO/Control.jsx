// resources/js/Pages/IO/Control.jsx
import AppLayout from '@/Layouts/AppLayout';
import useWebShocket from '@/Features/Device/useWebShocket'; // Importamos el hook
import WsConnection from '@/Features/Device/WebShockets';
import VirtualKeyboard from '@/Features/Device/VirtualKeyboard'; // Importamos tu nuevo teclado

export default function Control() {
    // Inicializamos el hook que controla el WebSocket en segundo plano
    const ws = useWebShocket();

    return (
        <AppLayout>
            <h1>IO Control</h1>
            
            {/* Le inyectamos todo el estado y funciones de red al gestor del socket */}
            <WsConnection ws={ws} />

            {/* Hookeamos el teclado al mismo nivel, pasándole lo estrictamente necesario */}
            <VirtualKeyboard 
                send={ws.send} 
                appendLog={ws.appendLog} 
                isAuthenticated={ws.status === 'Autenticado'} 
            />
        </AppLayout>
    );
}
// resources/js/Pages/IO/Control.jsx
import AppLayout from '@/Layouts/AppLayout';
import WsTest from '@/Features/Device/WsTest';

export default function Control() {
    return (
        <AppLayout>
            <h1>IO Control</h1>
            <WsTest />
        </AppLayout>
    );
}
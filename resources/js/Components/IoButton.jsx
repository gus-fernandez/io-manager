// resources/js/Components/IoButton.jsx
import { useState } from 'react';

export default function IoButton({ label, cc, initialOn = false, send, appendLog }) {
    const [isOn, setIsOn] = useState(initialOn);

    const handleToggle = () => {
        const nextState = !isOn;
        setIsOn(nextState);
        if (send) {
            send([0xB0, cc, nextState ? 127 : 0]);
            appendLog(`TX BUTTON — ${label}: ${nextState ? 'ON' : 'OFF'}`);
        }
    };

    return (
        <div className="flex flex-col items-center w-10 text-[10px] text-white select-none">
            <div
                onClick={handleToggle}
                className="w-10 h-10 bg-black border border-white rounded relative cursor-pointer box-border"
            >
                <div className={`
                    absolute top-1 left-1/2 -translate-x-1/2
                    w-3 h-1 rounded-sm transition-colors duration-200
                    ${isOn ? 'bg-red-500' : 'bg-neutral-700'}
                `} />
            </div>
            <div className="mt-1 whitespace-nowrap">{label}</div>
        </div>
    );
}
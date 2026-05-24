// resources/js/Components/IoButton.jsx
import { useState, useEffect } from 'react';

export default function IoButton({ label, cc, value, send, appendLog, activeCc, setActiveCc }) {
    const isGrouped = activeCc !== undefined;
    
    const [localIsOn, setLocalIsOn] = useState(value !== undefined ? value >= 64 : false);
    const isOn = isGrouped ? activeCc === cc : localIsOn;

    useEffect(() => {
        if (value !== undefined && !isGrouped) {
            setLocalIsOn(value >= 64);
        }
    }, [value, isGrouped]);

    const handleToggle = () => {
        if (isGrouped) {
            if (!isOn) {
                setActiveCc(cc);
                if (send) {
                    send([0xB0, cc, 127]);
                    appendLog(`TX BUTTON — ${label}: ON`);
                }
            }
        } else {
            const nextState = !localIsOn;
            setLocalIsOn(nextState);
            if (send) {
                send([0xB0, cc, nextState ? 127 : 0]);
                appendLog(`TX BUTTON — ${label}: ${nextState ? 'ON' : 'OFF'}`);
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-10 text-[10px] text-neutral-200 select-none">
            <div
                onClick={handleToggle}
                className="w-10 h-10 bg-neutral-950 border border-neutral-200 rounded relative cursor-pointer box-border"
            >
                <div className={`
                    absolute top-1 left-1/2 -translate-x-1/2
                    w-3 h-1 rounded-sm transition-colors duration-100
                    ${isOn ? 'bg-red-500' : 'bg-neutral-700'}
                `} />
            </div>
            <div className="mt-1 whitespace-nowrap">{label}</div>
        </div>
    );
}
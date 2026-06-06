// @/Features/Device/Control/components/ui/IoButton.jsx

/**
 * @file IoButton.jsx
 * @module Features/Control/components/ui/IoButton
 * @description Botón de control MIDI que soporta estados binarios (On/Off).
 * Puede operar de forma aislada (Toggle) o en grupo (Exclusive Selection) 
 * mediante el uso de `activeCc`.
 */

import { useState, useEffect } from 'react';

/**
 * @typedef {object} IoButtonProps
 * @property {string} label - Etiqueta descriptiva del control.
 * @property {number} cc - Número de Control Change MIDI.
 * @property {number} [value] - Valor MIDI actual (para sincronización).
 * @property {Function} send - Callback para enviar el comando MIDI.
 * @property {Function} appendLog - Callback para registrar la actividad.
 * @property {number} [activeCc] - (Opcional) CC activo actualmente en el grupo.
 * @property {Function} [setActiveCc] - (Opcional) Setter para el CC activo en el grupo.
 */

/**
 * Renderiza un botón interactivo con indicador visual de estado.
 * @param {IoButtonProps} props
 */
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
                send(0xB0, cc, nextState ? 127 : 0);
                appendLog(`TX BUTTON — ${label}: ${nextState ? 'ON' : 'OFF'}`);
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-10 text-[12px] text-neutral-200 select-none">
            <div
                onClick={handleToggle}
                className="w-10 h-10 bg-neutral-950 border border-neutral-200 rounded relative cursor-pointer box-border"
                role="switch"
                aria-checked={isOn}
                aria-label={label}
            >
                <div className={`
                    absolute top-1 left-1/2 -translate-x-1/2
                    w-3 h-1 rounded-sm transition-colors duration-100
                    ${isOn ? 'bg-rose-500' : 'bg-neutral-700'}
                `} />
            </div>
            <div className="mt-1 whitespace-nowrap text-neutral-400">{label}</div>
        </div>
    );
}
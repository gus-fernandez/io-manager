// @/Features/Device/Control/components/ui/IoSelector.jsx

/**
 * @file IoSelector.jsx
 * @module Features/Control/components/ui/IoSelector
 * @description Selector discreto que permite ciclar entre un set de opciones.
 * Mapea automáticamente el número de opciones disponibles al rango MIDI (0-127).
 * Soporta renderizado de texto simple o componentes SVG (como iconos).
 */

import { useState, useEffect } from 'react';

/**
 * @typedef {object} IoSelectorProps
 * @property {string} label - Etiqueta descriptiva del control.
 * @property {number} cc - Número de Control Change MIDI.
 * @property {object} options - Objeto cuyas claves son los valores visibles/seleccionables.
 * @property {number} [value=0] - Valor MIDI actual (0-127) para sincronización.
 * @property {Function} send - Callback para enviar el comando MIDI (0xB0, cc, val).
 * @property {Function} appendLog - Callback para registrar la actividad.
 * @property {Function} [onChange] - Callback opcional al cambiar la selección.
 * @property {string} [className] - Clases adicionales de Tailwind.
 */

/**
 * Renderiza un botón de selección circular.
 * @param {IoSelectorProps} props
 */

export default function IoSelector({ label, cc, options, value = 0, send, appendLog, onChange, className = '' }) {
    const keys = Object.keys(options);
    
    // Función helper para calcular qué índice del array corresponde al valor MIDI
    const getIndexFromMidi = (midiVal) => {
        if (keys.length <= 1) return 0;
        const step = 127 / (keys.length - 1);
        return Math.min(keys.length - 1, Math.round(midiVal / step));
    };

    const [currentIndex, setCurrentIndex] = useState(getIndexFromMidi(value));

    // Sincronización con el preset automatizado
    useEffect(() => {
        if (value !== undefined) {
            setCurrentIndex(getIndexFromMidi(value));
        }
    }, [value, options]);

    const handleNext = () => {
        if (keys.length === 0) return;

        const nextIndex = (currentIndex + 1) % keys.length;
        setCurrentIndex(nextIndex);

        let midiValue = 0;
        if (keys.length > 1) {
            midiValue = Math.round((nextIndex / (keys.length - 1)) * 127);
        }

        if (onChange) {
            onChange(keys[nextIndex]);
        }

        if (send) {
            send(0xB0, cc, midiValue);
            const logText = keys[nextIndex].replace(/\n/g, '');
            appendLog(`TX SELECTOR — ${label}: ${logText} (${midiValue})`);
        }
    };

    const currentKey = keys[currentIndex];
    const currentValue = options[currentKey];
    const isSvg = typeof currentValue === 'function';
    const SvgComponent = isSvg ? currentValue : null;

    return (
        <div className={`flex flex-col items-center w-10 text-[12px] text-neutral-200 select-none ${className}`}>
            <div
                onClick={handleNext}
                className="w-10 h-10 bg-neutral-950 border border-neutral-200 rounded cursor-pointer box-border flex items-center justify-center px-0.5"
                role="button"
                aria-label={`${label}: ${currentKey || 'None'}`}
            >
                {isSvg ? (
                    <div className="text-neutral-200 flex items-center justify-center w-full h-full p-1.5">
                        <SvgComponent />
                    </div>
                ) : (
                    <div className="text-[10px] whitespace-pre leading-[9px] w-full text-center text-neutral-200">
                        {currentKey || '---'}
                    </div>
                )}
            </div>
            <div className="mt-1 whitespace-nowrap text-neutral-400">{label}</div>
        </div>
    );
}
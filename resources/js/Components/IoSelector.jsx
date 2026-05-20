// resources/js/Components/IoSelector.jsx
import { useState } from 'react';

export default function IoSelector({ label, cc, options, initialIndex = 0, send, appendLog, onChange, className = '' }) {
    const keys = Object.keys(options);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

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
            send([0xB0, cc, midiValue]);
            const logText = keys[nextIndex].replace(/\n/g, '');
            appendLog(`TX SELECTOR — ${label}: ${logText} (${midiValue})`);
        }
    };

    const currentKey = keys[currentIndex];
    const currentValue = options[currentKey];
    const isSvg = typeof currentValue === 'function';
    const SvgComponent = isSvg ? currentValue : null;

    return (
        <div className={`flex flex-col items-center w-10 text-[10px] text--neutral-200 select-none ${className}`}>
            <div
                onClick={handleNext}
                className="w-10 h-10 bg-neutral-950 border border--neutral-200 rounded cursor-pointer box-border flex items-center justify-center px-0.5"
            >
                {isSvg ? (
                    <div className="text-neutral-200 flex items-center justify-center w-full h-full p-1.5">
                        <SvgComponent />
                    </div>
                ) : (
                    <div className="text-[10px] font-mono whitespace-pre leading-[9px] w-full text-center text-neutral-200">
                        {currentKey || '---'}
                    </div>
                )}
            </div>
            <div className="mt-1 whitespace-nowrap">{label}</div>
        </div>
    );
}
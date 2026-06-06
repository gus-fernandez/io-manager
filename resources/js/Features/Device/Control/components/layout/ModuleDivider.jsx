// @/Features/Device/Control/components/layout/ModuleDivider.jsx

/**
 * @file ModuleDivider.jsx
 * @module Features/Control/components/layout/ModuleDivider
 * @description Separador visual polimórfico. Renderiza un espaciador, una línea 
 * divisoria simple o un divisor con texto central según las props.
 */

/**
 * @typedef {object} ModuleDividerProps
 * @property {string} [label] - Texto a mostrar. Si es 'line', renderiza un divisor simple.
 * @property {string} [className] - Clases adicionales de Tailwind para estilo.
 */

/**
 * Renderiza el divisor basado en el modo (espaciador, línea, o etiquetado).
 * @param {ModuleDividerProps} props
 */
export default function ModuleDivider({ label, className = '' }) {
    if (!label) {
        return <div className={`w-full h-6 ${className}`} />;
    }
    if (label === 'line') {
        return (
            <div className={`flex items-center w-full h-6 self-stretch ${className}`}>
                <div className="flex-1 h-px bg-neutral-800" />
            </div>
        );
    }
    return (
        <div className={`flex items-center gap-2 w-full h-6 ${className}`}>
            <div className="flex-1 h-px bg-neutral-800" />
            {label && (
                <span className="uppercase text-[12px] tracking-widest text-neutral-500 whitespace-nowrap leading-none">
                    {label}
                </span>
            )}
            <div className="flex-1 h-px bg-neutral-800" />
        </div>
    );
}
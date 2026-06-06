// @/Components/DangerButton.jsx

/**
 * @file DangerButton.jsx
 * @module Components/DangerButton
 * @description Botón diseñado para acciones destructivas o críticas (ej. eliminar datos).
 * Utiliza una paleta de colores basada en tonos 'rose' para ofrecer una señal visual
 * clara de advertencia sin romper la cohesión minimalista del sistema.
 */

/**
 * @param {string} [className=''] - Clases CSS adicionales para customizar el botón.
 * @param {boolean} [disabled] - Si es true, reduce la opacidad y deshabilita la interacción.
 * @param {ReactNode} children - Contenido interno (texto o iconos).
 * @param {object} props - Atributos HTML nativos de botón (type, onClick, etc).
 */
export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center
                rounded-md
                border border-neutral-700
                bg-neutral-800
                px-4 py-2
                text-xs font-semibold uppercase tracking-widest
                text-neutral-400
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400
                hover:text-rose-400
                ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
// @/Components/Checkbox.jsx

/**
 * @file Checkbox.jsx
 * @module Components/Checkbox
 * @description Componente checkbox personalizado que mantiene la identidad visual 
 * del sistema de diseño (minimalismo, tonos neutros y estados de foco precisos).
 */

/**
 * @param {string} [className=''] - Clases CSS adicionales para customizar el aspecto.
 * @param {object} props - Atributos nativos de input (checked, onChange, disabled, etc.)
 */
export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`
                rounded border-neutral-700 bg-neutral-950 text-neutral-700
                checked:bg-neutral-700 checked:border-neutral-700
                focus:ring-0 focus:ring-offset-0 focus:outline-none
                focus-visible:ring-1 focus-visible:ring-neutral-700 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-900
                cursor-pointer transition-colors duration-150
                ${className}
            `}
        />
    );
}
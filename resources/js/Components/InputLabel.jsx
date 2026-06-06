// @/Components/InputLabel.jsx

/**
 * @file InputLabel.jsx
 * @module Components/InputLabel
 * @description Etiqueta (label) estandarizada para formularios. Garantiza la consistencia
 * tipográfica y de espaciado en toda la aplicación, manteniendo el estilo minimalista 
 * con texto pequeño, mayúsculas y espaciado entre caracteres (tracking).
 */

/**
 * Componente de etiqueta para formularios.
 * @param {object} props
 * @param {string} [props.value] - Texto del label (si existe, sobrescribe a children).
 * @param {string} [props.className] - Clases CSS adicionales.
 * @param {ReactNode} [props.children] - Contenido si no se usa value.
 * @param {object} [props] - Atributos nativos de label (como htmlFor).
 */
export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs uppercase tracking-widest text-neutral-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
// @/Components/InputError.jsx

/**
 * @file InputError.jsx
 * @module Components/InputError
 * @description Componente de visualización condicional para errores de validación. 
 * Se renderiza solo si existe un mensaje, evitando elementos vacíos en el DOM.
 */

/**
 * @param {string} [message] - Texto del mensaje de error a mostrar.
 * @param {string} [className=''] - Clases CSS adicionales para customizar el estilo.
 * @param {object} props - Atributos nativos de etiqueta <p> (id, style, etc.).
 */
export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-neutral-500 uppercase tracking-wider ' + className}
        >
            {message}
        </p>
    ) : null;
}
// @/Components/TextInput.jsx

/**
 * @file TextInput.jsx
 * @module Components/TextInput
 * @description Componente de input base que envuelve el elemento HTML `<input>`.
 * Implementa `forwardRef` para permitir el control de foco desde componentes padres
 * y gestiona automáticamente el estado de enfoque inicial.
 */

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * @param {string} [type='text'] - Tipo de input HTML.
 * @param {string} [className=''] - Clases CSS adicionales para sobreescribir estilos.
 * @param {boolean} [isFocused=false] - Flag para enfocar automáticamente al montar el componente.
 * @param {object} props - Atributos estándar de un input HTML (value, onChange, name, etc).
 * @param {React.Ref} ref - Ref forwardeada para acceder al elemento del DOM.
 */
export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            ref={localRef}
            className={
                'rounded-md border border-neutral-800 bg-neutral-950 text-neutral-300 placeholder:text-neutral-600 focus:border-neutral-700 focus:ring-0 focus:outline-none ' +
                className
            }
        />
    );
});
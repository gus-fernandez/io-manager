// @/Components/Modal.jsx

/**
 * @file Modal.jsx
 * @module Components/Modal
 * @description Modal contenedor de alto nivel que utiliza `React Portal` para renderizarse
 * directamente en el `document.body`. Esto evita problemas de contextos de apilamiento (z-index)
 * o desbordamiento (overflow) impuestos por contenedores padres.
 */

import { createPortal } from 'react-dom';

/**
 * @param {object} props
 * @param {function} props.onClose - Función callback invocada al hacer clic en el backdrop.
 * @param {ReactNode} props.children - Contenido del cuerpo del modal.
 * @param {string} [props.className='w-80'] - Clases CSS adicionales para customizar el contenedor.
 */
export default function Modal({ onClose, children, className = "w-80" }) {
    return createPortal(
        <div 
            className="font-whiterabbit fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div 
                role="dialog" 
                aria-modal="true"
                className={`bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-6 flex flex-col gap-4 ${className}`}
                onClick={(e) => e.stopPropagation()} 
            >
                {children}
            </div>
        </div>,
        document.body
    );
}
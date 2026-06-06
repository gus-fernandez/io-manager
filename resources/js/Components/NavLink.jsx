// @/Components/NavLink.jsx

/**
 * @file NavLink.jsx
 * @module Components/NavLink
 * @description Enlace de navegación estándar para la barra de navegación principal (desktop).
 * Implementa un estilo con borde inferior para indicar la ruta activa, proporcionando 
 * una clara jerarquía visual en el menú superior.
 */

import { Link } from '@inertiajs/react';

/**
 * @param {boolean} [active=false] - Si es true, aplica los estilos de estado activo.
 * @param {string} [className=''] - Clases CSS adicionales para customizar el enlace.
 * @param {ReactNode} children - Contenido interno (texto/iconos).
 * @param {object} props - Atributos nativos de Inertia Link (href, method, etc.).
 */
export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm uppercase tracking-widest transition-colors duration-150 focus:outline-none ' +
                (active
                    ? 'border-neutral-500 text-neutral-200'
                    : 'border-transparent text-neutral-500 hover:border-neutral-700 hover:text-neutral-300') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
// @/Components/ResponsiveNavLink.jsx

/**
 * @file ResponsiveNavLink.jsx
 * @module Components/ResponsiveNavLink
 * @description Enlace de navegación adaptable para menús responsive.
 * Gestiona automáticamente los estilos visuales de estado activo (borde lateral)
 * integrándose con el sistema de rutas de Inertia.js.
 */

import { Link } from '@inertiajs/react';

/**
 * @param {boolean} [active=false] - Indica si el enlace está activo, aplicando un borde izquierdo y color de fondo.
 * @param {string} [className=''] - Clases CSS adicionales para personalizar el estilo.
 * @param {ReactNode} children - Contenido del enlace.
 * @param {object} props - Atributos nativos de Inertia Link (href, method, etc.).
 */
export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-neutral-500 bg-neutral-900 text-neutral-200'
                    : 'border-transparent text-neutral-500 hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-300'
            } text-sm uppercase tracking-widest transition-colors duration-150 focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
import { Link } from '@inertiajs/react';

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
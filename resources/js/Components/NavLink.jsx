import { Link } from '@inertiajs/react';

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
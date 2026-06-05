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
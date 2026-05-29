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
                border border-neutral-800
                bg-neutral-900
                px-4 py-2
                text-xs font-semibold uppercase tracking-widest
                text-neutral-400
                transition-colors duration-150
                hover:text-neutral-200
                hover:border-neutral-700
                focus:outline-none
                focus:ring-0
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
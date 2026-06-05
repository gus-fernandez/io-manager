export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-neutral-200 transition duration-150 ease-in-out hover:bg-neutral-700 focus:bg-neutral-800 focus:outline-none focus:ring-0 active:bg-neutral-950 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
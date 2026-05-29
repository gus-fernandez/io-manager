export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs uppercase tracking-widest text-neutral-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
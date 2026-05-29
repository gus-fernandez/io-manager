export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-neutral-700 text-neutral-700 focus:ring-0 focus:ring-offset-0 ' +
                className
            }
        />
    );
}
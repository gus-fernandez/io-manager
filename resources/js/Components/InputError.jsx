export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-neutral-500 uppercase tracking-wider ' + className}
        >
            {message}
        </p>
    ) : null;
}
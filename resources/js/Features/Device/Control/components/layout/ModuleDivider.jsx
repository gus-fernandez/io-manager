// @/Features/Device/Control/components/layout/ModuleDivider.jsx

export default function ModuleDivider({ label, className = '' }) {
    if (!label) {
        return <div className={`w-full h-6 ${className}`} />;
    }
    if (label === 'line') {
        return (
            <div className={`flex items-center w-full h-6 self-stretch ${className}`}>
                <div className="flex-1 h-px bg-neutral-800" />
            </div>
        );
    }
    return (
        <div className={`flex items-center gap-2 w-full h-6 ${className}`}>
            <div className="flex-1 h-px bg-neutral-800" />
            {label && (
                <span className="uppercase text-[10px] tracking-widest text-neutral-500 whitespace-nowrap leading-none">
                    {label}
                </span>
            )}
            <div className="flex-1 h-px bg-neutral-800" />
        </div>
    );
}
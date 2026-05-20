// resources/js/Features/Device/moduleSection.jsx
export default function ModuleSection({ label, children }) {
    return (
        <div className="flex flex-col items-center gap-2">
            {/* h-4 reserva siempre el mismo espacio — con o sin label */}
            <div className="uppercase text-[10px] tracking-widest text-neutral-600 text-center h-4">
                {label ?? ''}
            </div>
            {children}
        </div>
    );
}
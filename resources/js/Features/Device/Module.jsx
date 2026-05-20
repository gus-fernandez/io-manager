// resources/js/Features/Device/Module.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Module({ id, title, colSpan = 1, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform:  CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                relative bg-[#0a0a0f] border border-neutral-800 rounded-lg p-3
                ${isDragging ? 'opacity-50 z-50 shadow-2xl shadow-black' : ''}
            `}
        >
            {/* Drag handle — esquina superior derecha */}
            <button
                {...attributes}
                {...listeners}
                className="
                    absolute top-2 right-2 w-5 h-5
                    flex items-center justify-center
                    text-neutral-600 hover:text-neutral-300
                    cursor-grab active:cursor-grabbing
                    rounded transition-colors duration-150
                    touch-none
                "
                tabIndex={-1}
                aria-label="Mover módulo"
            >
                {/* Grip icon */}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <circle cx="2" cy="2" r="1" />
                    <circle cx="5" cy="2" r="1" />
                    <circle cx="8" cy="2" r="1" />
                    <circle cx="2" cy="5" r="1" />
                    <circle cx="5" cy="5" r="1" />
                    <circle cx="8" cy="5" r="1" />
                    <circle cx="2" cy="8" r="1" />
                    <circle cx="5" cy="8" r="1" />
                    <circle cx="8" cy="8" r="1" />
                </svg>
            </button>

            {/* Título del módulo */}
            {title && (
                <div className="uppercase text-[12px] tracking-widest text-neutral-500 text-center mb-3 pr-4">
                    {title}
                </div>
            )}

            {children}
        </div>
    );
}
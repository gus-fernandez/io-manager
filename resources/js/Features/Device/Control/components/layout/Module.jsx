// @/Features/Device/Control/components/layout/Module.jsx

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Module({ id, title, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform:  CSS.Translate.toString(transform),
        transition,
    };
    
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                relative bg-neutral-900 rounded-lg p-2 px-3
                ${isDragging ? 'z-50' : ''}
            `}
        >
            <button
                {...attributes}
                {...listeners}
                className="
                    absolute top-2 right-2 w-4 h-4
                    flex items-center justify-center
                    text-neutral-500 hover:text-neutral-300
                    cursor-grab active:cursor-grabbing
                    rounded transition-colors duration-75
                    touch-none
                "
                tabIndex={-1}
                aria-label="Move module"
            >
                <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
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

            {title && (
                <div className="uppercase text-[14px] tracking-widest text-neutral-400 text-center px-4">
                    {title}
                </div>
            )}

            {children}
        </div>
    );
}
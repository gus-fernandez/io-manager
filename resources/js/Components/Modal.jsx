// @/Components/Modal.jsx

export default function Modal({ onClose, children, className = "w-80" }) {
    return (
        <div 
            className="font-whiterabbit fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className={`bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-6 flex flex-col gap-4 ${className}`}
                onClick={(e) => e.stopPropagation()} 
            >
                {children}
            </div>
        </div>
    );
}
// @/Features/Device/Shared/components/Icons.jsx

export const KeyboardIcon = {
    KEYBOARD: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <rect x="3" y="3" width="18" height="18" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />            
            <path d="M9 3V21" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 3V21" strokeLinecap="round" strokeLinejoin="round" />            
            <rect x="7.5" y="3" width="3" height="11" fill="currentColor" rx="0.5" strokeLinecap="round" strokeLinejoin="round" />            
            <rect x="13.5" y="3" width="3" height="11" fill="currentColor" rx="0.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

export const LockIcon = {
    LOCK: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
            <path d="M8 10V8a4 4 0 1 1 8 0v2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="5" y="10" width="14" height="12" rx="1.5" fill="currentColor" stroke="none" />
        </svg>
    )
};
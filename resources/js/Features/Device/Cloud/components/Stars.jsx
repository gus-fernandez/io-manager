// @/Features/Device/Cloud/components/Stars.jsx
import TextButton from "@/Components/TextButton";

export const Stars = ({ value, onRate, onRemove, hasVoted, userVote }) => {
    
    const displayValue = hasVoted ? userVote : value;
    const stars = Math.max(0, Math.min(5, Math.ceil(displayValue || 0)));
    
    const starColor = hasVoted 
        ? 'text-amber-500' 
        : 'text-neutral-500 hover:text-amber-500';

    return (
        <div className="flex items-center text-xs">
            <div 
                className="flex transition-colors"
                role="radiogroup" 
                aria-label="Rate this preset"
            >
                {[...Array(5)].map((_, i) => (
                    <TextButton
                        key={i}
                        role="radio"
                        aria-checked={i < stars}
                        aria-label={`${i + 1} stars`}
                        type="button"
                        onClick={() => onRate && onRate(i + 1)}
                        className={`focus:outline-none hover:scale-125 transition-transform ${starColor}`}
                        title={`Vote this preset with ${i + 1} ${i === 0 ? 'star' : 'stars'}.`}
                    >
                        {i < stars ? '★' : '☆'}
                    </TextButton>
                ))}
            </div>
            
            <TextButton 
                onClick={onRemove}
                disabled={!hasVoted}
                className={`ml-2 text-[10px] uppercase font-bold transition-colors ${
                    hasVoted 
                        ? 'text-neutral-400 hover:text-neutral-200' 
                        : 'text-neutral-700 cursor-default'
                }`}
                title="Remove your vote."
                aria-label="Remove your vote"
            >
                [x]
            </TextButton>
        </div>
    );
};
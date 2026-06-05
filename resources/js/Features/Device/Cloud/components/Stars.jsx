// @/Features/Device/Cloud/components/Stars.jsx
import TextButton from "@/Components/TextButton";

export const Stars = ({ value, onRate, onRemove, hasVoted, userVote }) => {
    
    const displayValue = hasVoted ? userVote : value;
    const stars = Math.max(0, Math.min(5, Math.ceil(displayValue || 0)));
    
    const starColor = hasVoted 
        ? 'text-yellow-600' 
        : 'text-neutral-500 hover:text-yellow-600';

    return (
        <div className="flex items-center text-xs">
            <div className="flex transition-colors">
                {[...Array(5)].map((_, i) => (
                    <TextButton
                        key={i}
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
                title="Delete your vote from this preset."
            >
                [x]
            </TextButton>
        </div>
    );
};
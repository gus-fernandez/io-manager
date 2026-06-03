// @/Features/Device/Cloud/components/RepoWrapper.jsx

import { Cat } from '@/Features/Device/Shared/utils/presetUtils.js';
import { needsSync } from '@/Features/Device/Cloud/utils/repoUtils.js';
import { Stars } from '@/Features/Device/Cloud/components/Stars';

export const RepoWrapper = ({ 
    title,
    titleAction,
    items,
    loading,
    renderActions,
    currentPreset,
    isPrivate = true,
    deviceNames = [],
    onRate,
    onRemove
}) => {
    
    if (loading) return (
        <div className="text-neutral-500 text-xs tracking-widest uppercase py-2">
            Loading {title}...
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-2">
                <h2 className="tracking-widest uppercase text-neutral-400">
                    {title}
                </h2>
                {titleAction && titleAction}
            </div>

            <ul className="divide-y divide-neutral-800">
                {items.map(item => {
                    const isSelected = currentPreset && 
                        item.name.trim().toUpperCase() === currentPreset.name?.trim().toUpperCase();

                    const isInDevice = item.inDevice || deviceNames.some(
                        name => name.toUpperCase() === item.name.trim().toUpperCase()
                    );

                    const isMuted = isPrivate 
                        ? needsSync(item) 
                        : (isInDevice || item.inCloud);
                    
                    const arrowColor = isInDevice ? 'text-emerald-500' : item.inCloud ? 'text-yellow-500' : 'text-neutral-700';
                    const titleColor = isMuted ? 'text-neutral-700' : 'text-neutral-200';
                    const textColor = isMuted ? 'text-neutral-700' : 'text-neutral-500';
                    const favColor = isMuted ? 'text-neutral-700' : 'text-neutral-500';

                    return (
                        <li 
                            key={item.key ?? item.id} 
                            className={`flex items-center gap-2 py-2 px-2 rounded-sm transition-colors ${
                                isSelected ? 'bg-neutral-900/80' : ''
                            }`}
                        >
                            <span className={`w-4 text-center text-xs ${arrowColor}`}>
                                ↑
                            </span>
                            <span className={`w-40 truncate uppercase text-sm ${titleColor}`}>
                                {item.name}
                            </span>
                            <span className={`flex-1 truncate text-xs ${textColor}`}>
                                {item.desc || ''}
                            </span>
                            <span className={`w-12 text-center text-xs uppercase ${textColor}`}>
                                {Cat[item.cat] && Cat[item.cat] !== "Undef" ? Cat[item.cat] : "OTHER"}
                            </span>
                            {item.rating != null && (
                                <div className="w-26 flex items-center justify-center gap-2 select-none">
                                    <Stars 
                                        value={item.rating}
                                        hasVoted={item.userVoted}
                                        userVote={item.userVote}
                                        onRate={(rateValue) => onRate && onRate(item, rateValue)}
                                        onRemove={() => onRemove && onRemove(item)}
                                    />
                                    <span className={`w-8 text-left text-xs ${textColor}`}>
                                        {Number(item.rating).toFixed(1)}
                                    </span>
                                </div>
                            )}
                            {isPrivate && (
                                <span className={`w-4 text-center text-xs ${favColor}`}>
                                    {item.fav ? '♥' : '♡'}
                                </span>
                            )}
                            <div className="text-right">
                                {renderActions && renderActions(item)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
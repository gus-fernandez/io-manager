// @/Features/Device/Cloud/components/RepoWrapper.jsx

import { Cat } from '@/Features/Device/Shared/utils/presetUtils.js';
import { needsSync } from '@/Features/Device/Cloud/utils/repoUtils.js';

export const RepoWrapper = ({ 
    title,
    titleAction,
    items,
    loading,
    renderActions,
    currentPreset,
    showFav = true,
    deviceNames = []
}) => {
    const isPrivate = showFav;
    
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
                    const isInDevice = item.inDevice || deviceNames.some(
                        name => name.toUpperCase() === item.name.trim().toUpperCase()
                    );

                    const isMuted = isPrivate 
                        ? needsSync(item) 
                        : (isInDevice || item.inCloud);

                    const titleColor = isMuted ? 'text-neutral-700' : 'text-neutral-200';
                    const textColor = isMuted ? 'text-neutral-700' : 'text-neutral-500';
                    const favColor = isMuted ? 'text-neutral-700' : 'text-neutral-500';

                    const arrowColor = isInDevice 
                        ? 'text-emerald-500' 
                        : (!isPrivate && item.inCloud ? 'text-yellow-500' : 'text-neutral-700');

                    return (
                        <li key={item.key ?? item.id} className="flex items-center gap-2 py-2">
                            <span className="w-4 text-center text-xs">
                                <span className={arrowColor}>↑</span>
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
                                <span className={`w-10 text-center text-xs ${textColor}`}>
                                    {Number(item.rating).toFixed(1)}
                                </span>
                            )}
                            {showFav && (
                                <span className={`w-4 text-center text-xs ${favColor}`}>
                                    {item.fav ? '♥' : '♡'}
                                </span>
                            )}
                            <div className="min-w-[80px] text-right">
                                {renderActions && renderActions(item)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
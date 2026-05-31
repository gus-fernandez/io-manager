// RepoWrapper.jsx

import {Cat} from '@/Features/Device/Shared/utils/presetUtils.js';
import { needsSync } from '@/Features/Device/Cloud/hooks/usePrivateRepo';

export const RepoWrapper = ({ title, titleAction, items, loading, renderActions, currentPreset }) => {

    const titleColor = (item) => needsSync(item) ? 'text-neutral-700' : 'text-neutral-200';
    const textColor = (item) => needsSync(item) ? 'text-neutral-700' : 'text-neutral-500';
    const favColor = (item) => needsSync(item) ? 'text-neutral-700' : 'text-yellow-600';
    
    if (loading) return (
        <div className="text-neutral-500 text-xs tracking-widest uppercase py-2">
            Loading {title}...
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between text-sm">
                <h2 className="tracking-widest uppercase text-neutral-400">
                    {title}
                </h2>
                    {titleAction && titleAction}
            </div>

            <ul className="divide-y divide-neutral-800">
                {items.map(item => (
                    <li key={item.key ?? item.id} className="flex items-center gap-2 py-2">
                        <span className="w-4 text-center text-xs">
                            {item.inDevice
                                ? <span className="text-emerald-500">↑</span>
                                : <span className="text-neutral-700">↑</span>
                            }
                        </span>
                        <span className={`w-40 truncate uppercase text-sm ${titleColor(item)}`}>
                            {item.name}
                        </span>
                        <span className={`flex-1 truncate text-xs ${textColor(item)}`}>
                            {item.desc || ''}
                        </span>
                        <span className={`w-8 text-center text-xs uppercase ${textColor(item)}`}>
                            {Cat[item.cat] && Cat[item.cat] !== "Undef" ? Cat[item.cat] : "OTHER"}
                        </span>
                        {item.rating != null && (
                            <span className={`w-10 text-center text-xs ${textColor(item)}`}>
                                {item.rating.toFixed(1)}
                            </span>
                        )}
                        <span className={`w-4 text-center text-xs ${favColor(item)}`}>
                            {item.fav ? '★' : '☆'}
                        </span>
                        <div className="ml-auto text-xs text-neutral-500 hover:text-neutral-200">
                            {renderActions && renderActions(item)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
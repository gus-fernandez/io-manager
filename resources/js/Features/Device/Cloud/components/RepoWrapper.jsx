// RepoWrapper.jsx

import {Cat} from '@/Features/Device/Shared/utils/presetUtils.js';

export const RepoWrapper = ({ title, items, loading, renderActions }) => {
    if (loading) return (
        <div className="text-neutral-500 text-xs tracking-widest uppercase py-2">
            Loading {title}...
        </div>
    );

    return (
        <div>
            <h2 className="text-xs tracking-widest uppercase text-neutral-400">
                {title}
            </h2>

            <ul className="divide-y divide-neutral-800">
                {items.map(item => (
                    <li key={item.id} className="flex items-center gap-2 py-2">
                        <span className="w-40 truncate text-neutral-200 uppercase text-sm">
                            {item.name}
                        </span>
                        <span className="flex-1 truncate text-neutral-500 text-xs">
                            {item.desc || '—'}
                        </span>
                        <span className="w-8 text-center text-neutral-500 text-xs uppercase">
                            {Cat[item.cat] && Cat[item.cat] !== "Undef" ? Cat[item.cat] : "OTHER"}
                        </span>
                        {item.rating != null && (
                            <span className="w-10 text-center text-neutral-400 text-xs">
                                {item.rating.toFixed(1)}
                            </span>
                        )}
                        <span className="w-4 text-center text-yellow-600 text-xs">
                            {item.fav ? '★' : '☆'}
                        </span>
                        <div className="ml-auto text-xs text-neutral-500 hover:text-neutral-300">
                            {renderActions && renderActions(item)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
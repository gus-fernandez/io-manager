// @/Features/Cloud/utils/sortUtils.js

const sortByProperty = (data, key, ascending = true) => {
    return [...data].sort((a, b) => {
        let valA = a[key] ?? '';
        let valB = b[key] ?? '';

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });
};

export const sortByName = (data, asc = true) => sortByProperty(data, 'name', asc);

export const sortByFavs = (data, asc = true) => {
    return [...data].sort((a, b) => {
        const valA = a.fav ? 1 : 0;
        const valB = b.fav ? 1 : 0;
        return asc ? (valB - valA) : (valA - valB);
    });
};

const baseCategoryOrder = [1, 2, 3, 4, 5, 6, 7, 0];

export const sortByCategory = (data, asc = true, activeCat = null) => {

    let currentOrder = baseCategoryOrder;
    
    if (activeCat !== null) {
        const activeIdx = baseCategoryOrder.indexOf(Number(activeCat));
        if (activeIdx !== -1) {
            currentOrder = [
                ...baseCategoryOrder.slice(activeIdx),
                ...baseCategoryOrder.slice(0, activeIdx)
            ];
        }
    }

    return [...data].sort((a, b) => {
        if (activeCat !== null) {
            if (a.cat === activeCat && b.cat !== activeCat) return -1;
            if (a.cat !== activeCat && b.cat === activeCat) return 1;
        }
        const getPriority = (cat) => {
            const index = currentOrder.indexOf(Number(cat));
            return index === -1 ? 99 : index;
        };
        const pA = getPriority(a.cat);
        const pB = getPriority(b.cat);

        return asc ? pA - pB : pB - pA;
    });
};

export const sortByRating = (data, asc = false) => sortByProperty(data, 'rating', asc);

export const sortByDeviceState = (data, asc = true) => {
    return [...data].sort((a, b) => {
        const getRank = (item) => {
            if (item.inDevice) return 1;
            if (item.inCloud) return 2;
            return 3;
        };

        const rankA = getRank(a);
        const rankB = getRank(b);

        if (rankA === rankB) {
            return a.name.localeCompare(b.name);
        }

        return asc ? rankA - rankB : rankB - rankA;
    });
};

export const sortPresets = (data, type, asc = true, activeCat = null) => {
    switch (type) {
        case 'name':     return sortByName(data, asc);
        case 'device':   return sortByDeviceState(data);
        case 'fav':      return sortByFavs(data);
        case 'cat':      return sortByCategory(data, asc, activeCat);
        case 'rating':   return sortByRating(data, asc);
        default:         return data;
    }
};
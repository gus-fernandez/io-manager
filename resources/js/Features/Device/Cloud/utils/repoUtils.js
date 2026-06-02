// @/Features/Device/Cloud/utils/repoUtils.js

export const mergePresets = (privateData, devicePresets) => {
    const merged = [];
    const matchedDeviceIds = new Set();

    privateData.forEach(cloud => {
        const cloudCrc = cloud.crc ?? cloud.crc32;
        
        const match = devicePresets.find(d => 
            !matchedDeviceIds.has(d.id) && 
            d.crc === cloudCrc && 
            d.name.toUpperCase() === cloud.name.toUpperCase()
        );

        merged.push({
            key:      `cloud-${cloud.id}`,
            name:     cloud.name,
            desc:     cloud.desc,
            rating:   cloud.rating,
            cat:      cloud.cat,
            fav:      cloud.fav ?? cloud.isFav,
            cloudId:  cloud.id,
            deviceId: match?.id ?? null,
            inCloud:  true,
            inDevice: !!match,
            crc:      cloudCrc,
        });
        
        if (match) matchedDeviceIds.add(match.id);
    });

    devicePresets
        .filter(d => !matchedDeviceIds.has(d.id))
        .forEach(device => {
            merged.push({
                key:      `device-${device.id}`,
                name:     device.name,
                desc:     null,
                rating:   null,
                cat:      device.catId,
                fav:      device.isFav,
                cloudId:  null,
                deviceId: device.id,
                inCloud:  false,
                inDevice: true,
                crc:      device.crc,
            });
        });

    return merged;
};

export const needsSync = (item) => !item.inCloud && item.inDevice;

export const canSync = (item, currentPreset) => {
    if (!currentPreset) return false;
    return !item.inCloud && item.inDevice && item.deviceId === currentPreset.id;
};

export const hasItemsToSync = (data) => data.some(item => needsSync(item));

export const hexToUint8Array = (hexString) => {
    if (!hexString) return new Uint8Array(128);
    const pairs = hexString.match(/.{1,2}/g) || [];
    return new Uint8Array(pairs.map(byte => parseInt(byte, 16)));
};

export const getNextFreeSlot = (devicePresets) => {
    const occupiedSlots = new Set(devicePresets.map(p => p.id));
    for (let i = 0; i < 128; i++) {
        if (!occupiedSlots.has(i)) return i;
    }
    return null;
};
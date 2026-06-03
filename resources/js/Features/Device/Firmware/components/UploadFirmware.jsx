// @/Features/Device/Firmware/components/UploadFirmware.jsx

import SecondaryButton from '@/Components/SecondaryButton';
import React, { useState } from 'react';

export default function UploadFirmware({ uploadFirmwareToServer, uploading, uploadSuccess, uploadError, instrument }) {

    const [file, setFile]               = useState(null);
    const [version, setVersion]         = useState('');
    const [channel, setChannel]         = useState('stable');
    const [description, setDescription] = useState('');
    const [localError, setLocalError]   = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!file) {
            setLocalError('.bin needed');
            return;
        }
        if (!version.trim()) {
            setLocalError('Version needed.');
            return;
        }

        try {
            await uploadFirmwareToServer({ file, version, channel, description });
            
            setFile(null);
            setVersion('');
            setChannel('stable');
            setDescription('');
            e.target.reset();
        } catch (err) {
        }
    };

    return (
        <div className="space-y-4 max-w-sm">
            <h3 className="text-xs tracking-widest uppercase text-neutral-400">
                Upload {instrument} Firmware:
            </h3>

            {uploadSuccess && (
                <p className="text-xs tracking-widest uppercase text-emerald-500">
                    Firmware uploaded.
                </p>
            )}

            {(uploadError || localError) && (
                <p className="text-xs tracking-widest uppercase text-rose-500">
                    {localError || uploadError}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900 border border-neutral-800 p-4 rounded-lg ">
                
            <div className="space-y-1">
                <label className="text-xs tracking-widest uppercase text-neutral-500">File (.bin)</label>
                
                <div className="relative">
                    <input 
                        id="firmware-input"
                        type="file" 
                        accept=".bin"
                        disabled={uploading}
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    
                    <label 
                        htmlFor="firmware-input"
                        className="flex items-center justify-center w-full cursor-pointer py-2 px-4 rounded border border-neutral-700 text-xs tracking-widest uppercase bg-neutral-900 text-neutral-500 hover:border-neutral-500 hover:text-neutral-200 transition-colors"
                    >
                        {file ? file.name : 'SELECT FILE'}
                    </label>
                </div>
            </div>

                <div className="space-y-1">
                    <label className="text-xs tracking-widest uppercase text-neutral-500">Version</label>
                    <input 
                        type="text" 
                        placeholder="Ej: 0.6.0"
                        value={version}
                        disabled={uploading}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-neutral-300 focus:border-neutral-500 focus:ring-0 outline-none placeholder:text-neutral-800"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs tracking-widest uppercase text-neutral-500">Channel</label>
                    <select 
                        value={channel}
                        disabled={uploading}
                        onChange={(e) => setChannel(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded p-2 text-xs tracking-widest uppercase text-neutral-300 focus:border-neutral-500 focus:ring-0 outline-none appearance-none"
                    >
                        <option value="stable">Stable</option>
                        <option value="nightly">Nightly</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs tracking-widest uppercase text-neutral-500">Release Notes</label>
                    <input 
                        type="text"
                        placeholder="Cambios o correcciones..."
                        value={description}
                        disabled={uploading}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded p-2 text-xs text-neutral-300 focus:border-neutral-500 focus:ring-0 outline-none placeholder:text-neutral-800"
                    />
                </div>

                <div className="pt-2 flex justify-center">
                    <SecondaryButton 
                        type="submit" 
                        disabled={uploading}
                    >
                        {uploading ? 'UPLOADING...' : 'UPLOAD FIRMWARE'}
                    </SecondaryButton>
                </div>
            </form>
        </div>
    );
}
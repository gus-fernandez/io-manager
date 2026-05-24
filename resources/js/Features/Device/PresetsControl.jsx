// resources/js/Features/Device/PresetsControl.jsx

export default function PresetsControl({ presets = [] }) {
    return (
        <div 
            style={{ 
                fontFamily: 'monospace', 
                marginTop: '16px',
                borderTop: '1px solid #333',
                paddingTop: '12px'
            }}
        >
            <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#aaa' }}>
                CATÁLOGO DE PRESETS:
            </div>

            <div 
                style={{
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    background: '#111', 
                    padding: '4px',
                    border: '1px solid #222'
                }}
            >
                {presets.length === 0 ? (
                    <span style={{ color: '#555', padding: '4px', display: 'block' }}>
                        Esperando metadata del dispositivo...
                    </span>
                ) : (
                    presets.map((preset) => {
                        // Estilos dinámicos según el estado del slot
                        const itemColor = preset.isEmpty ? '#555' : '#ccc';

                        return (
                            <div
                                key={preset.id}
                                style={{
                                    padding: '4px 8px',
                                    color: itemColor,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '13px',
                                    borderBottom: '1px solid #1a1a1a'
                                }}
                            >
                                <span>
                                    {String(preset.id).padStart(3, '0')} : {preset.name}
                                </span>
                                
                                <span style={{ fontSize: '11px', color: '#444' }}>
                                    {preset.isFav ? '★ ' : ''}
                                    {preset.category !== 'Undef' ? `[${preset.category}]` : ''}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
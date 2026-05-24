// resources/js/Features/Device/Modules/Osc.jsx
import { useState, useEffect } from 'react';
import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoButton from '@/Components/IoButton';
import IoKnob from '@/Components/IoKnob';
import IoSelector from '@/Components/IoSelector';
import { CC } from '@/Features/Device/Modules/midiCC';
import { WaveIcons } from '@/Features/Device/Modules/waveIcons';

const OscWaves = { "SIN": WaveIcons.OSC_SIN, "TRI": WaveIcons.OSC_TRI, "SAW": WaveIcons.OSC_SAW, "SQR": WaveIcons.OSC_SQR, "PLS": WaveIcons.OSC_PLS };
const OscWavesMaster = { "SIN": WaveIcons.OSC_SIN, "TRI": WaveIcons.OSC_TRI, "SAW": WaveIcons.OSC_SAW, "SQR": WaveIcons.OSC_SQR, "NZ": WaveIcons.OSC_NZ };

function OscSection({ prefix, label, isMaster = false, send, appendLog, values }) {
    // CORREGIDO: Devuelve la clave en string (ej: "OSC1_VOLUME") para leer de `values`
    const getCCKey = (suffix) => `${prefix}_${suffix}`;
    const ccKey = getCCKey('WAVEFORM');
    
    const getWaveKeyFromMidi = (val) => {
        const options = isMaster ? Object.keys(OscWavesMaster) : Object.keys(OscWaves);
        if (val === undefined) return "SIN";
        const step = 127 / (options.length - 1);
        const idx = Math.min(options.length - 1, Math.round(val / step));
        return options[idx];
    };

    const [activeWave, setActiveWave] = useState(() => getWaveKeyFromMidi(values[ccKey]));
    const isNoise = isMaster && activeWave === "NZ";

    useEffect(() => {
        if (values[ccKey] !== undefined) {
            setActiveWave(getWaveKeyFromMidi(values[ccKey]));
        }
    }, [values[ccKey]]);

    return (
        <div>
            <ModuleDivider label={label} className='col-span-3' />
            <div className="grid gap-x-4 gap-y-2 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                {/* CORREGIDO: cc usa CC[key] para el número MIDI, value usa values[key] para el estado */}
                <IoButton label="LFO" cc={CC[getCCKey('LFO_ACTIVE')]} value={values[getCCKey('LFO_ACTIVE')] ?? 0} send={send} appendLog={appendLog} />
                <IoButton label="AD" cc={CC[getCCKey('AD_ACTIVE')]} value={values[getCCKey('AD_ACTIVE')] ?? 0} send={send} appendLog={appendLog} />
                {isMaster
                    ? <div className="w-10 h-10" />
                    : <IoButton label="Hardsync" cc={CC[getCCKey('HARDSYNC')]} value={values[getCCKey('HARDSYNC')] ?? 0} send={send} appendLog={appendLog} />
                }
            </div>

            <ModuleDivider/>
            <div className="grid gap-x-4 gap-y-2 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoSelector label="Wave" cc={CC[getCCKey('WAVEFORM')]} options={isMaster ? OscWavesMaster : OscWaves} value={values[getCCKey('WAVEFORM')] ?? 0} send={send} appendLog={appendLog} onChange={setActiveWave} />
                <IoKnob label="Vol" cc={CC[getCCKey('VOLUME')]} value={values[getCCKey('VOLUME')] ?? 64} send={send} appendLog={appendLog} />
                {isMaster
                    ? <IoKnob label="Ring" cc={CC.RING_AMOUNT} value={values.RING_AMOUNT ?? 0} send={send} appendLog={appendLog} />
                    : <IoKnob label="Phase" cc={CC[getCCKey('PHASE')]} type="bipolar" value={values[getCCKey('PHASE')] ?? 64} send={send} appendLog={appendLog} />
                }
            </div>

            <ModuleDivider/>
            <div className="grid gap-x-4 gap-y-2 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label={isNoise ? "Color" : "Oct"} cc={CC[getCCKey('OCT')]} type={isNoise ? "unipolar" : "bipolar"} value={values[getCCKey('OCT')] ?? 64} send={send} appendLog={appendLog} />
                <IoKnob label={isNoise ? "Rate" : "Tune"} cc={CC[getCCKey('TUNE')]} type={isNoise ? "unipolar" : "bipolar"} value={values[getCCKey('TUNE')] ?? 64} send={send} appendLog={appendLog} />
                <IoKnob label={isNoise ? "Reso" : "Fine"} cc={CC[getCCKey('FINE')]} type={isNoise ? "unipolar" : "bipolar"} value={values[getCCKey('FINE')] ?? 64} send={send} appendLog={appendLog} />
            </div>
        </div>
    );
}

export default function OscModule({ id, send, appendLog, values = {} }) {
    return (
        <Module id={id} title="OSC">
            <div className="flex gap-8 justify-center">
                <OscSection prefix="OSC1" label="OSC 1" values={values} send={send} appendLog={appendLog} />
                <OscSection prefix="OSC2" label="OSC 2" values={values} send={send} appendLog={appendLog} />
                <OscSection prefix="OSC3" label="OSC 3" isMaster values={values} send={send} appendLog={appendLog} />
            </div>
        </Module>
    );
}
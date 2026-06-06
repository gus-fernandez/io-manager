// @/Features/Device/Control/components/modules/LfoModule.jsx

/**
 * @file LfoModule.jsx
 * @module Features/Control/components/modules/LfoModule
 * @description Módulo de control del LFO. Gestiona la forma de onda, 
 * velocidad, fase y destino de la modulación periódica.
 */

import Module from '@/Features/Device/Control/components/layout/Module';
import ModuleDivider from '@/Features/Device/Control/components/layout/ModuleDivider';
import IoKnob from '@/Features/Device/Control/components/ui/IoKnob';
import IoButton from '@/Features/Device/Control/components/ui/IoButton';
import IoSelector from '@/Features/Device/Control/components/ui/IoSelector';
import { CC } from '@/Features/Device/Shared/utils/midiCC';
import { WaveIcons } from '@/Features/Device/Control/components/WaveIcons.jsx';

const LfoWaves = {
    "SAW UP": WaveIcons.LFO_SAWUP,
    "SAW DN": WaveIcons.LFO_SAWDN,
    "SQR": WaveIcons.LFO_SQR,
    "TRI": WaveIcons.LFO_TRI,
    "SIN": WaveIcons.LFO_SIN,
    "RAND": WaveIcons.LFO_RAND
};

const LfoDest = {
    "NONE": 0,
    "VCF": 1,
    "OSC\nVOL": 2,    // Saltará de línea entre O_ y VOL
    "OSC\nFREQ": 3,   // Saltará de línea entre O_ y FREQ
    "OSC\nPHASE": 4,  // Saltará de línea entre O_ y PHASE
    "RING": 5,
    "SPREAD": 6,
    "PAN": 7
};

/**
 * @typedef {object} LfoModuleProps
 * @property {string} id - Identificador del módulo.
 * @property {Function} sendCC - Callback para envío de mensajes MIDI.
 * @property {Function} appendLog - Callback para logs.
 * @property {object} [values] - Estado actual de los parámetros (preset).
 */
export default function LfoModule({ id, sendCC, appendLog, values = {} }) {
    return (
        <Module id={id} title="LFO">
            <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <ModuleDivider label="line" className='col-span-3' />
                <IoButton label="Trigger" cc={CC.LFO_TRIGGER} value={values.LFO_TRIGGER ?? 0} send={sendCC} appendLog={appendLog} />
                <IoButton label="Sync" cc={CC.LFO_SYNC} value={values.LFO_SYNC ?? 0} send={sendCC} appendLog={appendLog} />
                <div className="w-10 h-10" />
                <ModuleDivider className='col-span-3' />
                <IoSelector label="Wave" cc={CC.LFO_WAVEFORM} options={LfoWaves} value={values.LFO_WAVEFORM ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Amount" cc={CC.LFO_AMOUNT} type="bipolar" value={values.LFO_AMOUNT ?? 64} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Rate" cc={CC.LFO_RATE} value={values.LFO_RATE ?? 100} send={sendCC} appendLog={appendLog} />
                <ModuleDivider className='col-span-3' />
                <IoKnob label="Phase" cc={CC.LFO_PHASE} type="bipolar" value={values.LFO_PHASE ?? 64} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Delay" cc={CC.LFO_DELAY} type="bipolar" value={values.LFO_DELAY ?? 64} send={sendCC} appendLog={appendLog} />
                <IoSelector label="Dest" cc={CC.LFO_DEST} options={LfoDest} value={values.LFO_DEST ?? 0} send={sendCC} appendLog={appendLog} />
            </div>
        </Module>
    );
}
// resources/js/Features/Device/Modules/Lfo.jsx

import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import IoSelector from '@/Components/IoSelector';
import { CC } from '@/Features/Device/Modules/midiCC';
import { WaveIcons } from '@/Features/Device/Modules/waveIcons';

const LfoWaves = {
    "SAW UP": WaveIcons.LFO_SAWUP,
    "SAW DN": WaveIcons.LFO_SAWUP,
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

export default function LfoModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="LFO">
            <div className="grid gap-x-4 justify-items-center items-end"
                style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <ModuleDivider label="line" className='col-span-3' />
                <IoButton label="Trigger" cc={CC.LFO_TRIGGER} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="Sync"  cc={CC.LFO_SYNC} initialOn={false} send={send} appendLog={appendLog} />
                <div className="w-10 h-10" />
                <ModuleDivider className='col-span-3' />
                <IoSelector   
                    label="Wave" 
                    cc={CC.LFO_WAVEFORM} 
                    options={LfoWaves} 
                    initialIndex={0} 
                    send={send} 
                    appendLog={appendLog} 
                />
                <IoKnob   label="Amount" cc={CC.LFO_AMOUNT} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Rate" cc={CC.LFO_RATE} initialValue={100} send={send} appendLog={appendLog} />
                <ModuleDivider className='col-span-3' />
                <IoKnob   label="Phase" cc={CC.LFO_PHASE} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Delay" cc={CC.LFO_DELAY} initialValue={100} send={send} appendLog={appendLog} />
                <IoSelector   
                    label="Dest" 
                    cc={CC.LFO_DEST} 
                    options={LfoDest} 
                    initialIndex={0} 
                    send={send} 
                    appendLog={appendLog} 
                />
            </div>
        </Module>
    );
}
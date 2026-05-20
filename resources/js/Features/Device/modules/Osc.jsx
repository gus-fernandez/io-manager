// resources/js/Features/Device/Modules/Osc.jsx

import { useState } from 'react';
import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoButton from '@/Components/IoButton';
import IoKnob   from '@/Components/IoKnob';
import IoSelector   from '@/Components/IoSelector';
import { CC } from '@/Features/Device/Modules/midiCC';
import { WaveIcons } from '@/Features/Device/Modules/waveIcons';

const OscWaves = {
    "SIN": WaveIcons.OSC_SIN,
    "TRI": WaveIcons.OSC_TRI,
    "SAW": WaveIcons.OSC_SAW,
    "SQR": WaveIcons.OSC_SQR,
    "PLS": WaveIcons.OSC_PLS
};

const OscWavesMaster = {
    "SIN": WaveIcons.OSC_SIN,
    "TRI": WaveIcons.OSC_TRI,
    "SAW": WaveIcons.OSC_SAW,
    "SQR": WaveIcons.OSC_SQR,
    "NZ":  WaveIcons.OSC_NZ
};

function OscSection({ prefix, label, isMaster = false, send, appendLog }) {
    const getCC = (suffix) => CC[`${prefix}_${suffix}`];
    const [activeWave, setActiveWave] = useState("SIN");
    const isNoise = isMaster && activeWave === "NZ";

    return (
        <div>
            <ModuleDivider label={label} className='col-span-3' />
            <div className="grid gap-x-4 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoButton label="LFO" cc={getCC('LFO_ACTIVE')} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="AD"  cc={getCC('AD_ACTIVE')}  initialOn={false} send={send} appendLog={appendLog} />
                {isMaster
                    ? <div className="w-10 h-10" />
                    : <IoButton label="Hardsync" cc={getCC('HARDSYNC')} initialOn={false} send={send} appendLog={appendLog} />
                }
            </div>

            <ModuleDivider/>
            <div className="grid gap-x-4 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoSelector   
                    label="Wave" 
                    cc={getCC('WAVEFORM')} 
                    options={isMaster ? OscWavesMaster : OscWaves } 
                    initialIndex={0} 
                    send={send} 
                    appendLog={appendLog} 
                    onChange={setActiveWave}
                />
                <IoKnob label="Vol"  cc={getCC('VOLUME')}   initialValue={64} send={send} appendLog={appendLog} />
                {isMaster
                    ? <IoKnob label="Ring"  cc={CC.RING_AMOUNT}   initialValue={0}  send={send} appendLog={appendLog} />
                    : <IoKnob label="Phase" cc={getCC('PHASE')}   initialValue={0}  send={send} appendLog={appendLog} />
                }
            </div>

            <ModuleDivider/>
            <div className="grid gap-x-4 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label={isNoise ? "Color" : "Oct"}  cc={getCC('OCT')}  initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label={isNoise ? "Rate" : "Tune"} cc={getCC('TUNE')} initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label={isNoise ? "Reso" : "Fine"} cc={getCC('FINE')} initialValue={64} send={send} appendLog={appendLog} />
            </div>
        </div>
    );
}

export default function OscModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="OSC">
            <div className="flex gap-8 justify-center">
                <OscSection prefix="OSC1" label="OSC 1" send={send} appendLog={appendLog} />
                <OscSection prefix="OSC2" label="OSC 2" send={send} appendLog={appendLog} />
                <OscSection prefix="OSC3" label="OSC 3" isMaster send={send} appendLog={appendLog} />
            </div>
        </Module>
    );
}
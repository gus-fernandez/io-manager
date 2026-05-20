// resources/js/Features/Device/Modules/oscModule.jsx
import Module from '@/Features/Device/Module';
import ModuleSection from '@/Features/Device/moduleSection';
import IoButton from '@/Components/IoButton';
import IoKnob   from '@/Components/IoKnob';
import { CC } from '@/Features/Device/modules/midiCC';

function OscSection({ prefix, label, hasHardsync = false, hasPhase = false, send, appendLog }) {
    const getCC = (suffix) => CC[`${prefix}_${suffix}`];

    return (
        <ModuleSection label={label}>
            {/* Fila 1: LFO, AD, [Hardsync] */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoButton label="LFO" cc={getCC('LFO_ACTIVE')} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="AD"  cc={getCC('AD_ACTIVE')}  initialOn={false} send={send} appendLog={appendLog} />
                {hasHardsync
                    ? <IoButton label="Hardsync" cc={getCC('HARDSYNC')} initialOn={false} send={send} appendLog={appendLog} />
                    : <div className="w-10 h-10" />
                }
            </div>

            {/* Fila 2: Wave, Vol, [Phase|Ring] */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label="Wave" cc={getCC('WAVEFORM')} initialValue={0}  send={send} appendLog={appendLog} />
                <IoKnob label="Vol"  cc={getCC('VOLUME')}   initialValue={64} send={send} appendLog={appendLog} />
                {hasPhase
                    ? <IoKnob label="Phase" cc={getCC('PHASE')}   initialValue={0}  send={send} appendLog={appendLog} />
                    : <IoKnob label="Ring"  cc={CC.RING_AMOUNT}   initialValue={0}  send={send} appendLog={appendLog} />
                }
            </div>

            {/* Fila 3: Oct, Tune, Fine */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label="Oct"  cc={getCC('OCT')}  initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label="Tune" cc={getCC('TUNE')} initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label="Fine" cc={getCC('FINE')} initialValue={64} send={send} appendLog={appendLog} />
            </div>
        </ModuleSection>
    );
}

export default function OscModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="OSC">
            <div className="flex gap-6 justify-center">
                <OscSection prefix="OSC1" label="OSC 1" hasHardsync hasPhase send={send} appendLog={appendLog} />
                <OscSection prefix="OSC2" label="OSC 2" hasHardsync hasPhase send={send} appendLog={appendLog} />
                <OscSection prefix="OSC3" label="OSC 3"                      send={send} appendLog={appendLog} />
            </div>
        </Module>
    );
}
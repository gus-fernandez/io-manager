// resources/js/Features/Device/modules/OscModule.jsx
import Module from '@/Features/Device/Module';
import IoButton from '@/Components/IoButton';
import IoKnob   from '@/Components/IoKnob';
import { CC } from '@/Constants/midiCC';

function OscSection({ prefix, label, hasHardsync = false, hasPhase = false, send, appendLog }) {
    // Helper para buscar el CC dinámicamente en objeto global
    const getCC = (suffix) => CC[`${prefix}_${suffix}`];

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="uppercase text-[9px] tracking-widest text-neutral-600 text-center">
                {label}
            </div>

            {/* Fila 1: LFO, AD, [Hardsync] */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoButton label="LFO" cc={getCC('LFO_ACTIVE')} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="AD"  cc={getCC('AD_ACTIVE')}  initialOn={false} send={send} appendLog={appendLog} />
                {hasHardsync ? (
                    <IoButton label="Hardsync" cc={getCC('HARDSYNC')} initialOn={false} send={send} appendLog={appendLog} />
                ) : (
                    <div className="w-10 h-10" />
                )}
            </div>

            {/* Fila 2: Wave, Vol, [Phase] */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label="Wave" cc={getCC('WAVEFORM')} initialValue={0}  send={send} appendLog={appendLog} />
                <IoKnob label="Vol"  cc={getCC('VOLUME')}   initialValue={64} send={send} appendLog={appendLog} />
                {hasPhase ? (
                    <IoKnob label="Phase" cc={getCC('PHASE')} initialValue={0} send={send} appendLog={appendLog} />
                ) : (
                    <div className="w-10 h-10" />
                )}
            </div>

            {/* Fila 3: Oct, Tune, Fine */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label="Oct"  cc={getCC('OCT')}  initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label="Tune" cc={getCC('TUNE')} initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label="Fine" cc={getCC('FINE')} initialValue={64} send={send} appendLog={appendLog} />
            </div>
        </div>
    );
}

export default function OscModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="OSC">
            <div className="flex gap-6 justify-center">
                <OscSection prefix="OSC1" label="OSC 1" hasHardsync hasPhase send={send} appendLog={appendLog} />
                <OscSection prefix="OSC2" label="OSC 2" hasHardsync hasPhase send={send} appendLog={appendLog} />
                <OscSection prefix="OSC3" label="OSC 3" send={send} appendLog={appendLog} />
            </div>
        </Module>
    );
}
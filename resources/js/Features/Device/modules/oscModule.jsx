// resources/js/Features/Device/modules/OscModule.jsx
import Module from '@/Features/Device/Module';
import IoButton from '@/Components/IoButton';
import IoKnob   from '@/Components/IoKnob';

// CC numbers según tu VoiceManager
const CC = {
    OSC1_LFO:       20,
    OSC1_AD:        21,
    OSC1_HARDSYNC:  22,
    OSC1_WAVE:      23,
    OSC1_VOL:       24,
    OSC1_PHASE:     25,
    OSC1_OCT:       26,
    OSC1_TUNE:      27,
    OSC1_FINE:      28,

    OSC2_LFO:       30,
    OSC2_AD:        31,
    OSC2_HARDSYNC:  32,
    OSC2_WAVE:      33,
    OSC2_VOL:       34,
    OSC2_PHASE:     35,
    OSC2_OCT:       36,
    OSC2_TUNE:      37,
    OSC2_FINE:      38,

    OSC3_LFO:       40,
    OSC3_AD:        41,
    OSC3_WAVE:      42,
    OSC3_VOL:       43,
    OSC3_OCT:       44,
    OSC3_TUNE:      45,
    OSC3_FINE:      46,
};

function OscSection({ label, cc, send, appendLog }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="uppercase text-[9px] tracking-widest text-neutral-600 text-center">
                {label}
            </div>

            {/* Fila 1: botones */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoButton label="LFO"      cc={cc.lfo}      initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="AD"       cc={cc.ad}       initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="Hardsync" cc={cc.hardsync} initialOn={false} send={send} appendLog={appendLog} />
            </div>

            {/* Fila 2: wave, vol, phase */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label="Wave"  cc={cc.wave}  initialValue={0}   send={send} appendLog={appendLog} />
                <IoKnob label="Vol"   cc={cc.vol}   initialValue={64}  send={send} appendLog={appendLog} />
                <IoKnob label="Phase" cc={cc.phase} initialValue={0}   send={send} appendLog={appendLog} />
            </div>

            {/* Fila 3: oct, tune, fine */}
            <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                <IoKnob label="Oct"  cc={cc.oct}  initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label="Tune" cc={cc.tune} initialValue={64} send={send} appendLog={appendLog} />
                <IoKnob label="Fine" cc={cc.fine} initialValue={64} send={send} appendLog={appendLog} />
            </div>
        </div>
    );
}

export default function OscModule({ id, colSpan, send, appendLog }) {
    return (
        <Module id={id} colSpan={colSpan} title="OSC">
            <div className="flex gap-6 justify-center">
                <OscSection
                    label="OSC 1"
                    cc={{ lfo: CC.OSC1_LFO, ad: CC.OSC1_AD, hardsync: CC.OSC1_HARDSYNC,
                          wave: CC.OSC1_WAVE, vol: CC.OSC1_VOL, phase: CC.OSC1_PHASE,
                          oct: CC.OSC1_OCT, tune: CC.OSC1_TUNE, fine: CC.OSC1_FINE }}
                    send={send}
                    appendLog={appendLog}
                />
                <OscSection
                    label="OSC 2"
                    cc={{ lfo: CC.OSC2_LFO, ad: CC.OSC2_AD, hardsync: CC.OSC2_HARDSYNC,
                          wave: CC.OSC2_WAVE, vol: CC.OSC2_VOL, phase: CC.OSC2_PHASE,
                          oct: CC.OSC2_OCT, tune: CC.OSC2_TUNE, fine: CC.OSC2_FINE }}
                    send={send}
                    appendLog={appendLog}
                />
                <OscSection
                    label="OSC 3"
                    cc={{ lfo: CC.OSC3_LFO, ad: CC.OSC3_AD, hardsync: CC.OSC3_HARDSYNC,
                          wave: CC.OSC3_WAVE, vol: CC.OSC3_VOL, phase: CC.OSC3_PHASE,
                          oct: CC.OSC3_OCT, tune: CC.OSC3_TUNE, fine: CC.OSC3_FINE }}
                    send={send}
                    appendLog={appendLog}
                />
            </div>
        </Module>
    );
}
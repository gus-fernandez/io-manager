// resources/js/Features/Device/Modules/Fx.jsx

import Module from '@/Features/Device/Module';
import ModuleSection from '@/Features/Device/moduleSection';
import IoSlider from '@/Components/IoSlider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function FxModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="FX">
            <ModuleSection>
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                    style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                    <IoKnob   label="Bit" cc={CC.FX_BITCRUSH} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Rate" cc={CC.FX_RATECRUSH} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="LPF" cc={CC.FX_CRUSH_LPF} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Mix" cc={CC.FX_RATE_MIX} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Wet" cc={CC.FX_CHORUS_WET} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Rate" cc={CC.FX_CHORUS_RATE} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Depth" cc={CC.FX_CHORUS_DEPTH} initialValue={100} send={send} appendLog={appendLog} />
                    <IoButton label="Delay x2" cc={CC.FX_DELAY_X2} initialOn={false} send={send} appendLog={appendLog} />
                    <IoKnob   label="Wet" cc={CC.FX_DELAY_WET} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Time" cc={CC.FX_DELAY_TIME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Feed" cc={CC.FX_DELAY_FEED} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="LPF" cc={CC.FX_DELAY_LPF} initialValue={100} send={send} appendLog={appendLog} />
                </div>
            </ModuleSection>
        </Module>
    );
}
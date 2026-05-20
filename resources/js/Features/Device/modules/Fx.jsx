// resources/js/Features/Device/Modules/Fx.jsx

import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function FxModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="FX">
                <div className="grid gap-x-4 justify-items-center items-end"
                     style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                <ModuleDivider label="Crusher" className='col-span-4' />
                <IoKnob   label="Bit" cc={CC.FX_BITCRUSH} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Rate" cc={CC.FX_RATECRUSH} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="LPF" cc={CC.FX_CRUSH_LPF} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Mix" cc={CC.FX_RATE_MIX} initialValue={100} send={send} appendLog={appendLog} />
                <ModuleDivider label="Chorus" className='col-span-3' />
                <ModuleDivider/>
                <IoKnob   label="Wet" cc={CC.FX_CHORUS_WET} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Rate" cc={CC.FX_CHORUS_RATE} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Depth" cc={CC.FX_CHORUS_DEPTH} initialValue={100} send={send} appendLog={appendLog} />
                <IoButton label="Delay x2" cc={CC.FX_DELAY_X2} initialOn={false} send={send} appendLog={appendLog} />
                <ModuleDivider label="Delay" className='col-span-3' />
                <ModuleDivider/>
                <IoKnob   label="Wet" cc={CC.FX_DELAY_WET} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Time" cc={CC.FX_DELAY_TIME} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="Feed" cc={CC.FX_DELAY_FEED} initialValue={100} send={send} appendLog={appendLog} />
                <IoKnob   label="LPF" cc={CC.FX_DELAY_LPF} initialValue={100} send={send} appendLog={appendLog} />
                </div>
        </Module>
    );
}
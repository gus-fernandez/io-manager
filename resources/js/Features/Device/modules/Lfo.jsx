// resources/js/Features/Device/Modules/Lfo.jsx

import Module from '@/Features/Device/Module';
import ModuleSection from '@/Features/Device/moduleSection';
import IoSlider from '@/Components/IoSlider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function LfoModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="LFO">
            <ModuleSection>
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                    style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                    <IoButton label="Trigger" cc={CC.GLIDE_AUTO}    initialOn={false} send={send} appendLog={appendLog} />
                    <IoButton label="Sync"  cc={CC.VOICE_MODE}    initialOn={false} send={send} appendLog={appendLog} />
                    <div className="w-10 h-10" />
                    <IoKnob   label="Wave" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Amount" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Rate" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Phase" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Delay" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Dest" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                </div>
            </ModuleSection>
        </Module>
    );
}
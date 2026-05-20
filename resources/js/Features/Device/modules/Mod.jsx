// resources/js/Features/Device/Modules/Mod.jsx

import Module from '@/Features/Device/Module';
import ModuleSection from '@/Features/Device/moduleSection';
import IoSlider from '@/Components/IoSlider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function ModModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="MOD">
            <ModuleSection>
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                    style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>
                    <IoButton label="Bend" cc={CC.GLIDE_AUTO} initialOn={false} send={send} appendLog={appendLog} />
                    <IoButton label="Vel" cc={CC.VOICE_MODE} initialOn={false} send={send} appendLog={appendLog} />
                    <IoButton label="Mod" cc={CC.HOLD} initialOn={false} send={send} appendLog={appendLog} />
                    <IoKnob   label="Freq" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Cut" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Vol" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Mod Rate" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoButton label="Sync" cc={CC.EXT} initialOn={false} send={send} appendLog={appendLog} />
                </div>
            </ModuleSection>
        </Module>
    );
}
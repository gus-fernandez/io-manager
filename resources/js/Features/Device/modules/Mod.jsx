// resources/js/Features/Device/Modules/Mod.jsx

import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoSlider from '@/Components/IoSlider';
import IoBend from '@/Components/IoBend';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function ModModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="MOD">
            <div className="grid gap-x-4 justify-items-center items-end"
                style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                <ModuleDivider label="line" className='col-span-4' />
                <IoButton label="Bend" cc={CC.GLIDE_AUTO} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="Vel" cc={CC.VOICE_MODE} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="Mod" cc={CC.HOLD} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="M-Sync" cc={CC.EXT} initialOn={false} send={send} appendLog={appendLog} />
            </div>
            <div className="flex gap-x-4 justify-center">
                <div className="grid gap-x-4 justify-items-center items-end"
                    style={{ gridTemplateColumns: 'repeat(2, 40px)' }}>
                    <ModuleDivider className='col-span-2' />

                    <IoBend label="Bend" channel={0} className="row-span-2" send={send} appendLog={appendLog} />
                    <IoSlider label="Mod" cc={CC.MODWHEEL} className="row-span-2" send={send} appendLog={appendLog} />
                    
                </div>
                <div className="grid gap-x-4 justify-items-center items-end"
                    style={{ gridTemplateColumns: 'repeat(2, 40px)' }}>
                    <IoKnob label="M-Rate" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob label="Freq" cc={CC.BEND_TO_FREQ} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob label="Cut" cc={CC.BEND_TO_CUT} initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob label="Vol" cc={CC.MASTER_VOLUME} initialValue={100} send={send} appendLog={appendLog} />
                </div>
            </div>
        </Module>
    );
}
// resources/js/Features/Device/Modules/Arp.jsx

import Module from '@/Features/Device/Module';
import ModuleSection from '@/Features/Device/moduleSection';
import IoSlider from '@/Components/IoSlider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function ArpModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="ARP">
            <ModuleSection>
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                    style={{ gridTemplateColumns: 'repeat(2, 40px)' }}>
                    <IoButton label="Sync"  cc={CC.ARP_SYNC}  initialOn={false}  send={send} appendLog={appendLog} />
                    <div className="w-10 h-10" />
                    <IoKnob   label="Type"  cc={CC.ARP_TYPE}  initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Rate"  cc={CC.ARP_RATE}  initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Len"   cc={CC.ARP_LEN}   initialValue={100} send={send} appendLog={appendLog} />
                    <IoKnob   label="Steps" cc={CC.ARP_STEPS} initialValue={100} send={send} appendLog={appendLog} />
                </div>
            </ModuleSection>
        </Module>
    );
}
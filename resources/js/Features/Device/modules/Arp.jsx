// resources/js/Features/Device/Modules/Arp.jsx

import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoSelector from '@/Components/IoSelector';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

const ArpType = {
    "OFF": 0,       
    "UP": 1,        // 1, 2, 3, 4
    "DOWN": 2,      // 4, 3, 2, 1
    "UP\nDOWN1": 3,   // 1, 2, 3, 4, 3, 2
    "UP\nDOWN2": 4,   // 1, 2, 3, 4, 4, 3, 2, 1
    "DOWN\nUP1": 5,   // 4, 3, 2, 1, 2, 3
    "DOWN\nUP2": 6,   // 4, 3, 2, 1, 1, 2, 3, 4
    "RAND1": 7,   // randomize with repeat
    "RAND2": 8    // randomice without repeat
};
export default function ArpModule({ id, send, appendLog, values = {} }) {
    return (
        <Module id={id} title="ARP">
            <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(2, 40px)' }}>
                <ModuleDivider label="line" className='col-span-2'/>
                <IoButton label="Sync" cc={CC.ARP_SYNC} value={values.ARP_SYNC ?? 0} send={send} appendLog={appendLog} />
                <div className="w-10 h-10" />
                <ModuleDivider className='col-span-2'/>
                <IoSelector label="Type" cc={CC.ARP_TYPE} options={ArpType} value={values.ARP_TYPE ?? 0} send={send} appendLog={appendLog} />
                <IoKnob label="Rate" cc={CC.ARP_RATE} value={values.ARP_RATE ?? 100} send={send} appendLog={appendLog} />
                <ModuleDivider className='col-span-2'/>
                <IoKnob label="Len" cc={CC.ARP_LEN} value={values.ARP_LEN ?? 100} send={send} appendLog={appendLog} />
                <IoKnob label="Steps" cc={CC.ARP_STEPS} type="bipolar" value={values.ARP_STEPS ?? 64} send={send} appendLog={appendLog} />
            </div>
        </Module>
    );
}
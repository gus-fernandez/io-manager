// resources/js/Features/Device/Modules/Mod.jsx

import { useState } from 'react';
import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoSlider from '@/Components/IoSlider';
import IoBend from '@/Components/IoBend';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function ModModule({ id, send, appendLog }) {
    const [activeGroupCc, setActiveGroupCc] = useState(CC.SELECT_MODWHEEL);
    return (
        <Module id={id} title="MOD">
            <div className="grid gap-x-4 justify-items-center items-end"
                style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                <ModuleDivider label="line" className='col-span-4' />
                <IoButton 
                    label="Bend" 
                    cc={CC.SELECT_BEND} 
                    activeCc={activeGroupCc} 
                    setActiveCc={setActiveGroupCc} 
                    send={send} 
                    appendLog={appendLog} 
                />
                <IoButton 
                    label="Vel" 
                    cc={CC.SELECT_VEL} 
                    activeCc={activeGroupCc} 
                    setActiveCc={setActiveGroupCc} 
                    send={send} 
                    appendLog={appendLog} 
                />
                <IoButton 
                    label="Mod" 
                    cc={CC.SELECT_MODWHEEL} 
                    activeCc={activeGroupCc} 
                    setActiveCc={setActiveGroupCc} 
                    send={send} 
                    appendLog={appendLog} 
                />
                <IoButton label="M-Sync" cc={CC.MODWHEEL_SYNC} initialOn={false} send={send} appendLog={appendLog} />
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
                    <IoKnob label="M-Rate" cc={CC.MOD_RATE} initialValue={100} send={send} appendLog={appendLog} />
                    {activeGroupCc === CC.SELECT_BEND && (
                    <>
                        <IoKnob label="B-Freq" cc={CC.BEND_TO_FREQ} initialValue={100} send={send} appendLog={appendLog} />
                        <IoKnob label="B-Cut" cc={CC.BEND_TO_CUT} initialValue={100} send={send} appendLog={appendLog} />
                        <IoKnob label="_" initialValue={0} />
                    </>)}
                    {activeGroupCc === CC.SELECT_VEL && (
                    <>
                        <IoKnob label="_" initialValue={0} />
                        <IoKnob label="V-Cut" cc={CC.VEL_TO_CUT} initialValue={100} send={send} appendLog={appendLog} />
                        <IoKnob label="V-Vol" cc={CC.VEL_TO_VOL} initialValue={100} send={send} appendLog={appendLog} />
                    </>)}
                    {activeGroupCc === CC.SELECT_MODWHEEL && (
                    <>
                        <IoKnob label="M-Freq" cc={CC.MOD_TO_FREQ} initialValue={100} send={send} appendLog={appendLog} />
                        <IoKnob label="M-Cut" cc={CC.MOD_TO_CUT} initialValue={100} send={send} appendLog={appendLog} />
                        <IoKnob label="M-Pan" cc={CC.MOD_TO_PAN} initialValue={100} send={send} appendLog={appendLog} />
                    </>)}
                </div>
            </div>
        </Module>
    );
}
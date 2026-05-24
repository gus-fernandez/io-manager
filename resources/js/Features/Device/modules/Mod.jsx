// resources/js/Features/Device/Modules/Mod.jsx
import { useState, useEffect } from 'react';
import Module from '@/Features/Device/Module';
import ModuleDivider from '@/Features/Device/ModuleDivider';
import IoSlider from '@/Components/IoSlider';
import IoBend from '@/Components/IoBend';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/Modules/midiCC';

export default function ModModule({ id, send, appendLog, values = {} }) {
    // Inicialización del grupo de botones en base al preset activo
    const [activeGroupCc, setActiveGroupCc] = useState(() => {
        if (values.SELECT_BEND === 127) return CC.SELECT_BEND;
        if (values.SELECT_VEL === 127) return CC.SELECT_VEL;
        return CC.SELECT_MODWHEEL;
    });

    // Sincronizar el grupo de botones si cambia el preset
    useEffect(() => {
        if (values.SELECT_BEND === 127) setActiveGroupCc(CC.SELECT_BEND);
        else if (values.SELECT_VEL === 127) setActiveGroupCc(CC.SELECT_VEL);
        else if (values.SELECT_MODWHEEL === 127) setActiveGroupCc(CC.SELECT_MODWHEEL);
    }, [values.SELECT_BEND, values.SELECT_VEL, values.SELECT_MODWHEEL]);

    return (
        <Module id={id} title="MOD">
            <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                <ModuleDivider label="line" className='col-span-4' />
                <IoButton label="Bend" cc={CC.SELECT_BEND} activeCc={activeGroupCc} setActiveCc={setActiveGroupCc} send={send} appendLog={appendLog} />
                <IoButton label="Vel" cc={CC.SELECT_VEL} activeCc={activeGroupCc} setActiveCc={setActiveGroupCc} send={send} appendLog={appendLog} />
                <IoButton label="Mod" cc={CC.SELECT_MODWHEEL} activeCc={activeGroupCc} setActiveCc={setActiveGroupCc} send={send} appendLog={appendLog} />
                <IoButton label="M-Sync" cc={CC.MODWHEEL_SYNC} value={values.MODWHEEL_SYNC ?? 0} send={send} appendLog={appendLog} />
            </div>
            <div className="flex gap-x-4 justify-center">
                <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(2, 40px)' }}>
                    <ModuleDivider className='col-span-2' />
                    {/* IoBend no usa values ni CC por diseño elástico */}
                    <IoBend label="Bend" channel={0} className="row-span-2" send={send} appendLog={appendLog} />
                    <IoSlider label="Mod" cc={CC.MODWHEEL} value={values.MODWHEEL ?? 0} className="row-span-2" send={send} appendLog={appendLog} />
                </div>
                <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(2, 40px)' }}>
                    <IoKnob label="M-Rate" cc={CC.MOD_RATE} value={values.MOD_RATE ?? 100} send={send} appendLog={appendLog} />
                    
                    {activeGroupCc === CC.SELECT_BEND && (
                        <>
                            <IoKnob label="B-Freq" cc={CC.BEND_TO_FREQ} value={values.BEND_TO_FREQ ?? 100} send={send} appendLog={appendLog} />
                            <IoKnob label="B-Cut" cc={CC.BEND_TO_CUT} value={values.BEND_TO_CUT ?? 100} send={send} appendLog={appendLog} />
                            <IoKnob label="_" value={0} />
                        </>
                    )}
                    {activeGroupCc === CC.SELECT_VEL && (
                        <>
                            <IoKnob label="_" value={0} />
                            <IoKnob label="V-Cut" cc={CC.VEL_TO_CUT} value={values.VEL_TO_CUT ?? 100} send={send} appendLog={appendLog} />
                            <IoKnob label="V-Vol" cc={CC.VEL_TO_VOL} value={values.VEL_TO_VOL ?? 100} send={send} appendLog={appendLog} />
                        </>
                    )}
                    {activeGroupCc === CC.SELECT_MODWHEEL && (
                        <>
                            <IoKnob label="M-Freq" cc={CC.MOD_TO_FREQ} value={values.MOD_TO_FREQ ?? 100} send={send} appendLog={appendLog} />
                            <IoKnob label="M-Cut" cc={CC.MOD_TO_CUT} value={values.MOD_TO_CUT ?? 100} send={send} appendLog={appendLog} />
                            <IoKnob label="M-Pan" cc={CC.MOD_TO_PAN} value={values.MOD_TO_PAN ?? 100} send={send} appendLog={appendLog} />
                        </>
                    )}
                </div>
            </div>
        </Module>
    );
}
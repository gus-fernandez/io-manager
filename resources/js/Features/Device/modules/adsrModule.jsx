// resources/js/Features/Device/Modules/adsrModule.jsx
import Module from '@/Features/Device/Module';
import ModuleSection from '@/Features/Device/moduleSection';
import IoSlider from '@/Components/IoSlider';
import IoKnob from '@/Components/IoKnob';
import IoButton from '@/Components/IoButton';
import { CC } from '@/Features/Device/modules/midiCC';

export default function AdsrModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="ADSR">
            <div className="flex gap-6 justify-center">
                <ModuleSection label="VCF">
                    <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                        style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                        
                        {/* Fila 1 y 2: Sliders */}
                        <IoSlider label="A" cc={CC.VCF_A} className="row-span-2" send={send} appendLog={appendLog} />
                        <IoSlider label="D" cc={CC.VCF_D} className="row-span-2" send={send} appendLog={appendLog} />
                        <IoSlider label="S" cc={CC.VCF_S} className="row-span-2" send={send} appendLog={appendLog} />
                        <IoSlider label="R" cc={CC.VCF_R} className="row-span-2" send={send} appendLog={appendLog} />

                        {/* Fila 3: Knobs */}
                        <IoKnob label="Type"  cc={CC.VCF_FILTER_TYPE} initialValue={64} send={send} appendLog={appendLog} />
                        <IoKnob label="Reso"  cc={CC.VCF_RESONANCE}   initialValue={127} send={send} appendLog={appendLog} />
                        <IoKnob label="Cut"  cc={CC.VCF_CUTOFF}   initialValue={127} send={send} appendLog={appendLog} />
                        <IoKnob label="KeyFollow"  cc={CC.VCF_KEYFOLLOW}   initialValue={127} send={send} appendLog={appendLog} />
                    </div>
                </ModuleSection>
                <ModuleSection>
                    <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                        style={{ gridTemplateColumns: 'repeat(1, 40px)' }}>

                        <IoButton label="AD-Sync" cc={CC.AD_SYNC}    initialOn={false} send={send} appendLog={appendLog} />                    
                        <IoButton label="AD-Reset" cc={CC.AD_RESET}  initialOn={false} send={send} appendLog={appendLog} />
                        <IoKnob label="Dest"  cc={CC.VCF_ENV}   initialValue={127} send={send} appendLog={appendLog} />
                    </div>
                </ModuleSection>
                <ModuleSection label="AMP">
                    <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                        style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                        
                        {/* Fila 1 y 2: Sliders */}
                        <IoSlider label="A" cc={CC.AMP_A} className="row-span-2" send={send} appendLog={appendLog} />
                        <IoSlider label="D" cc={CC.AMP_D} className="row-span-2" send={send} appendLog={appendLog} />
                        <IoSlider label="S" cc={CC.AMP_S} className="row-span-2" send={send} appendLog={appendLog} />
                        <IoSlider label="R" cc={CC.AMP_R} className="row-span-2" send={send} appendLog={appendLog} />

                        {/* Fila 3: Knobs */}
                        <IoKnob label="AD-A"  cc={CC.VCF_FILTER_TYPE} initialValue={64} send={send} appendLog={appendLog} />
                        <IoKnob label="AD-D"  cc={CC.VCF_RESONANCE}   initialValue={127} send={send} appendLog={appendLog} />
                        <IoKnob label="AD-Am"  cc={CC.VCF_CUTOFF}   initialValue={127} send={send} appendLog={appendLog} />
                        <IoKnob label="Dest"  cc={CC.VCF_CUTOFF}   initialValue={127} send={send} appendLog={appendLog} />
                    </div>
                </ModuleSection>
            </div>
        </Module>
    );
}
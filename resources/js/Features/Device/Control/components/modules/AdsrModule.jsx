// @/Features/Device/Control/components/modules/AdsrModule.jsx

import Module from '@/Features/Device/Control/components/layout/Module';
import ModuleDivider from '@/Features/Device/Control/components/layout/ModuleDivider';
import IoSlider from '@/Features/Device/Control/components/ui/IoSlider';
import IoKnob from '@/Features/Device/Control/components/ui/IoKnob';
import IoButton from '@/Features/Device/Control/components/ui/IoButton';
import IoSelector from '@/Features/Device/Control/components/ui/IoSelector';
import { CC } from '@/Features/Device/Control/utils/midiCC';

const VcfType = {
    "LPF\n24dB": 0, "HPF\n24dB": 1, "BPF\n24dB": 2, "NPF\n24dB": 3,
    "LPF\n12dB": 4, "HPF\n12dB": 5, "BPF\n12dB": 6, "NPF\n12dB": 7
};

const AdDest = {
    "NONE": 0, "OSC\nVOL": 1, "OSC\nFREQ": 2, "OSC\nPHASE": 3,
    "RING": 4, "SPREAD": 5, "LFO\nRATE": 6, "LFO\nAMOUNT": 7
};

export default function AdsrModule({ id, sendCC, appendLog, values = {} }) {
    return (
        <Module id={id} title="ADSR">
            <div className="flex gap-8 justify-center">
                <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                    <ModuleDivider label="VCF" className='col-span-4' />
                    <IoSlider label="A" cc={CC.VCF_A} value={values.VCF_A ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    <IoSlider label="D" cc={CC.VCF_D} value={values.VCF_D ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    <IoSlider label="S" cc={CC.VCF_S} value={values.VCF_S ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    <IoSlider label="R" cc={CC.VCF_R} value={values.VCF_R ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    
                    <ModuleDivider className='col-span-4' />
                    <IoSelector label="Type" cc={CC.VCF_FILTER_TYPE} options={VcfType} value={values.VCF_FILTER_TYPE ?? 0} send={sendCC} appendLog={appendLog} />
                    <IoKnob label="Reso" cc={CC.VCF_RESONANCE} value={values.VCF_RESONANCE ?? 127} send={sendCC} appendLog={appendLog} />
                    <IoKnob label="Cut" cc={CC.VCF_CUTOFF} value={values.VCF_CUTOFF ?? 127} send={sendCC} appendLog={appendLog} />
                    <IoKnob label="KeyFollow" cc={CC.VCF_KEYFOLLOW} value={values.VCF_KEYFOLLOW ?? 127} send={sendCC} appendLog={appendLog} />
                </div>

                <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(1, 40px)' }}>
                    <ModuleDivider/>
                    <IoButton label="AD Sync" cc={CC.AD_SYNC} value={values.AD_SYNC ?? 0} send={sendCC} appendLog={appendLog} />
                    <ModuleDivider/>               
                    <IoButton label="AD Reset" cc={CC.AD_RESET} value={values.AD_RESET ?? 0} send={sendCC} appendLog={appendLog} />
                    <ModuleDivider label="line" />
                    <IoKnob label="Env" cc={CC.VCF_ENV} type="bipolar" value={values.VCF_ENV ?? 127} send={sendCC} appendLog={appendLog} />
                </div>
   
                <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                    <ModuleDivider label="AMP" className='col-span-4' />
                    <IoSlider label="A" cc={CC.AMP_A} value={values.AMP_A ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    <IoSlider label="D" cc={CC.AMP_D} value={values.AMP_D ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    <IoSlider label="S" cc={CC.AMP_S} value={values.AMP_S ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />
                    <IoSlider label="R" cc={CC.AMP_R} value={values.AMP_R ?? 0} className="row-span-2" send={sendCC} appendLog={appendLog} />

                    <ModuleDivider label="AD" className='col-span-4' />
                    <IoKnob label="A" cc={CC.AD_ATTACK} value={values.AD_ATTACK ?? 64} send={sendCC} appendLog={appendLog} />
                    <IoKnob label="D" cc={CC.AD_DECAY} value={values.AD_DECAY ?? 127} send={sendCC} appendLog={appendLog} />
                    <IoKnob label="Amount" cc={CC.AD_AMOUNT} type="bipolar" value={values.AD_AMOUNT ?? 127} send={sendCC} appendLog={appendLog} />
                    <IoSelector label="Dest" cc={CC.AD_DEST} options={AdDest} value={values.AD_DEST ?? 0} send={sendCC} appendLog={appendLog} />
                </div>
            </div>
        </Module>
    );
}
// @/Features/Device/Control/components/modules/LfoModule.jsx

import Module from '@/Features/Device/Control/components/layout/Module';
import ModuleDivider from '@/Features/Device/Control/components/layout/ModuleDivider';
import IoButton from '@/Features/Device/Control/components/ui/IoButton';
import IoKnob from '@/Features/Device/Control/components/ui/IoKnob';
import { CC } from '@/Features/Device/Control/utils/midiCC';

export default function MasterModule({ id, sendCC, appendLog, values = {} }) {
    return (
        <Module id={id} title="MASTER">
            <div className="grid gap-x-4 justify-items-center items-end px-2" style={{ gridTemplateColumns: 'repeat(5, 40px)' }}>
                <ModuleDivider label="line" className='col-span-5' />
                <IoButton label="GlAuto" cc={CC.GLIDE_AUTO} value={values.GLIDE_AUTO ?? 0} send={sendCC} appendLog={appendLog} />
                <IoButton label="Mono" cc={CC.VOICE_MODE} value={values.VOICE_MODE ?? 0} send={sendCC} appendLog={appendLog} />
                <IoButton label="Hold" cc={CC.HOLD} value={values.HOLD ?? 0} send={sendCC} appendLog={appendLog} />
                <IoButton label="Ext" cc={CC.EXT} value={values.EXT ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="BPM" cc={CC.BPM} value={values.BPM ?? 120} send={sendCC} appendLog={appendLog} />

                <ModuleDivider className='col-span-5' />
                <IoKnob label="GlTime" cc={CC.GLIDE_TIME} value={values.GLIDE_TIME ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Unison" cc={CC.UNI_VOICES} value={values.UNI_VOICES ?? 1} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Drift" cc={CC.OSC_DRIFT} value={values.OSC_DRIFT ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Detune" cc={CC.GLOBAL_DETUNE} value={values.GLOBAL_DETUNE ?? 64} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Div" cc={CC.CLK_DIVIDER} value={values.CLK_DIVIDER ?? 0} send={sendCC} appendLog={appendLog} />

                <ModuleDivider className='col-span-5' />
                <IoKnob label="Spread" cc={CC.OSC_SPREAD} value={values.OSC_SPREAD ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="HPF" cc={CC.FX_HPF_CUT} value={values.FX_HPF_CUT ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Pre" cc={CC.PRE_GAIN} value={values.PRE_GAIN ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Sat" cc={CC.FX_SATURATION} value={values.FX_SATURATION ?? 0} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Master" cc={CC.MASTER_VOLUME} value={values.MASTER_VOLUME ?? 100} send={sendCC} appendLog={appendLog} />
            </div>
        </Module>
    );
}
// resources/js/Features/Device/modules/MasterModule.jsx
import Module from '@/Features/Device/Module';
import IoButton from '@/Components/IoButton';
import IoKnob   from '@/Components/IoKnob';
import { CC } from '@/Constants/midiCC';

export default function MasterModule({ id, send, appendLog }) {
    return (
        <Module id={id} title="MASTER">
            <div className="flex flex-col items-center gap-4">
                
                {/* Fila 1: Glide Auto, Poly/Mono, Hold, Ext, Master Vol */}
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                     style={{ gridTemplateColumns: 'repeat(5, 40px)' }}>
                    <IoButton label="AutoGl"  cc={CC.GLIDE_AUTO}     initialOn={false} send={send} appendLog={appendLog} />
                    <IoButton label="Po/Mo"  cc={CC.VOICE_MODE}     initialOn={false} send={send} appendLog={appendLog} />
                    <IoButton label="Hold"  cc={CC.HOLD}           initialOn={false} send={send} appendLog={appendLog} />
                    <IoButton label="Ext"   cc={CC.EXT}            initialOn={false} send={send} appendLog={appendLog} />
                    <IoKnob   label="Master"   cc={CC.MASTER_VOLUME}  initialValue={100} send={send} appendLog={appendLog} />
                </div>

                {/* Fila 2: Glide Time, Uni Voices, Osc Drift, Detune, BPM */}
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                     style={{ gridTemplateColumns: 'repeat(5, 40px)' }}>
                    <IoKnob label="GlideT"  cc={CC.GLIDE_TIME}     initialValue={0}  send={send} appendLog={appendLog} />
                    <IoKnob label="UniV" cc={CC.UNI_VOICES}     initialValue={1}  send={send} appendLog={appendLog} />
                    <IoKnob label="Drift" cc={CC.OSC_DRIFT}      initialValue={0}  send={send} appendLog={appendLog} />
                    <IoKnob label="Detune" cc={CC.GLOBAL_DETUNE}  initialValue={64} send={send} appendLog={appendLog} />
                    <IoKnob label="BPM"   cc={CC.BPM}            initialValue={120} send={send} appendLog={appendLog} />
                </div>

                {/* Fila 3: HPF, Spread, Pregain, Sat, Div */}
                <div className="grid gap-x-3 gap-y-2 justify-items-center items-end"
                     style={{ gridTemplateColumns: 'repeat(5, 40px)' }}>
                    <IoKnob label="HPF"   cc={CC.FX_HPF_CUT}     initialValue={0}  send={send} appendLog={appendLog} />
                    <IoKnob label="Spread" cc={CC.OSC_SPREAD}     initialValue={0}  send={send} appendLog={appendLog} />
                    <IoKnob label="Pre"  cc={CC.PRE_GAIN}       initialValue={0}  send={send} appendLog={appendLog} />
                    <IoKnob label="Sat"   cc={CC.FX_SATURATION}  initialValue={0}  send={send} appendLog={appendLog} />
                    <IoKnob label="Div"   cc={CC.CLK_DIVIDER}    initialValue={0}  send={send} appendLog={appendLog} />
                </div>

            </div>
        </Module>
    );
}
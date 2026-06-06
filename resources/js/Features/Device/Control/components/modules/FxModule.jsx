// @/Features/Device/Control/components/modules/FxModule.jsx

/**
 * @file FxModule.jsx
 * @module Features/Control/components/modules/FxModule
 * @description Módulo de efectos que encapsula la cadena de procesamiento de audio.
 * Permite la manipulación de distorsión digital, chorus y delay mediante 
 * controles rotativos y botones de configuración.
 */

import Module from '@/Features/Device/Control/components/layout/Module';
import ModuleDivider from '@/Features/Device/Control/components/layout/ModuleDivider';
import IoKnob from '@/Features/Device/Control/components/ui/IoKnob';
import IoButton from '@/Features/Device/Control/components/ui/IoButton';
import { CC } from '@/Features/Device/Shared/utils/midiCC';

/**
 * @typedef {object} FxModuleProps
 * @property {string} id - Identificador del módulo.
 * @property {Function} sendCC - Callback para envío de mensajes MIDI.
 * @property {Function} appendLog - Callback para logs.
 * @property {object} [values] - Estado actual de los parámetros (preset).
 */

export default function FxModule({ id, sendCC, appendLog, values = {} }) {
    return (
        <Module id={id} title="FX">
            <div className="grid gap-x-4 justify-items-center items-end" style={{ gridTemplateColumns: 'repeat(4, 40px)' }}>
                <ModuleDivider label="Crusher" className='col-span-4' />
                <IoKnob label="Bit" cc={CC.FX_BITCRUSH} value={values.FX_BITCRUSH ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Rate" cc={CC.FX_RATECRUSH} value={values.FX_RATECRUSH ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="LPF" cc={CC.FX_CRUSH_LPF} value={values.FX_CRUSH_LPF ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Mix" cc={CC.FX_RATE_MIX} value={values.FX_RATE_MIX ?? 100} send={sendCC} appendLog={appendLog} />
                
                <ModuleDivider label="Chorus" className='col-span-3' />
                <ModuleDivider/>
                <IoKnob label="Wet" cc={CC.FX_CHORUS_WET} value={values.FX_CHORUS_WET ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Rate" cc={CC.FX_CHORUS_RATE} value={values.FX_CHORUS_RATE ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Depth" cc={CC.FX_CHORUS_DEPTH} value={values.FX_CHORUS_DEPTH ?? 100} send={sendCC} appendLog={appendLog} />
                <IoButton label="Delay x2" cc={CC.FX_DELAY_X2} value={values.FX_DELAY_X2 ?? 0} send={sendCC} appendLog={appendLog} />
                
                <ModuleDivider label="Delay" className='col-span-3' />
                <ModuleDivider/>
                <IoKnob label="Wet" cc={CC.FX_DELAY_WET} value={values.FX_DELAY_WET ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Time" cc={CC.FX_DELAY_TIME} value={values.FX_DELAY_TIME ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="Feed" cc={CC.FX_DELAY_FEED} value={values.FX_DELAY_FEED ?? 100} send={sendCC} appendLog={appendLog} />
                <IoKnob label="LPF" cc={CC.FX_DELAY_LPF} value={values.FX_DELAY_LPF ?? 100} send={sendCC} appendLog={appendLog} />
            </div>
        </Module>
    );
}
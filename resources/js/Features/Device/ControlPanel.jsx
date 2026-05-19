// resources/js/Features/Device/ControlPanel.jsx

import IoButton from '@/Components/IoButton';
import IoKnob   from '@/Components/IoKnob';
import IoSlider from '@/Components/IoSlider';

export default function ControlPanel({ send, appendLog, isAuthenticated }) {
    if (!isAuthenticated) return null;

    return (
        <div className="inline-block bg-black border border-neutral-800 rounded-md p-3 my-3">
            <div className="uppercase text-[11px] tracking-widest text-neutral-500 text-center mb-4">
                IO-8 Test Panel
            </div>

            <div className="grid gap-x-4 gap-y-2.5 justify-items-center items-end"
                 style={{ gridTemplateColumns: 'repeat(3, 40px)' }}>

                <IoButton label="Play" cc={102} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="Stop" cc={103} initialOn={false} send={send} appendLog={appendLog} />
                <IoButton label="Rec"  cc={104} initialOn={true}  send={send} appendLog={appendLog} />

                <IoKnob label="Vol" cc={7}  initialValue={50}  send={send} appendLog={appendLog} />
                <IoKnob label="Tno" cc={10} initialValue={0}   send={send} appendLog={appendLog} />
                <IoKnob label="Bal" cc={8}  initialValue={100} send={send} appendLog={appendLog} />

                <IoSlider label="Fil" cc={74} initialValue={25} send={send} appendLog={appendLog} />
                <IoSlider label="Res" cc={71} initialValue={75} send={send} appendLog={appendLog} />
                <IoSlider label="Env" cc={79} initialValue={0}  send={send} appendLog={appendLog} />
            </div>
        </div>
    );
}
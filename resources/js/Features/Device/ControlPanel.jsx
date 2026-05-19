// resources/js/Features/Device/ControlPanel.jsx

import IoButton from '@/Components/IoButton';
import IoKnob from '@/Components/IoKnob';
import IoSlider from '@/Components/IoSlider';

export default function ControlPanel({ send, appendLog, isAuthenticated }) {
    if (!isAuthenticated) return null;

    return (
        <div style={{
            background: '#000',
            padding: '12px',
            margin: '12px 0',
            borderRadius: '6px',
            display: 'inline-block',
            border: '1px solid #222'
        }}>
            <div style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '16px', color: '#888', textAlign: 'center' }}>
                IO-8 Test Panel
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 40px)',
                gap: '10px 16px',
                justifyItems: 'center',
                alignItems: 'end'
            }}>
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
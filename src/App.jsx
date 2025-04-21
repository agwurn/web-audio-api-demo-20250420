import { useEffect, useRef, useState } from 'react'
import { createAudioCore } from './audioNodes/core'
import { createDistortion } from './audioNodes/distortion'
import { createEQ } from './audioNodes/eq'
import { createReverb } from './audioNodes/reverb'
import { createAnalyser } from './audioNodes/analyser'

function App() {
  const timeCanvasRef = useRef(null)
  const freqCanvasRef = useRef(null)
  const [ctx] = useState(new AudioContext())
  const [isPlaying, setIsPlaying] = useState(false)
  const eqState = useRef({ low: 0, mid: 0, high: 0 })

  const updateEQ = (part, value) => {
    eqState.current[part] = value
    window.audioNodes.eq.setEQ(eqState.current)
  }

  useEffect(() => {
    const core = createAudioCore(ctx)

    const distortionNode = createDistortion(ctx)
    const eqNode = createEQ(ctx)
    const reverbNode = createReverb(ctx)
    const analyserNode = createAnalyser(ctx, {
      timeCanvas: timeCanvasRef.current,
      freqCanvas: freqCanvasRef.current
    })

    // effect nodes
    core.connect(distortionNode)
    distortionNode.connect(eqNode)
    eqNode.connect(reverbNode)
    reverbNode.connect(analyserNode)
    analyserNode.connect(ctx.destination)

    window.audioNodes = { core, dist: distortionNode, eq: eqNode, reverb: reverbNode }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => {
        if (!isPlaying) {
          ctx.resume()
          window.audioNodes.core.play()
        } else {
          window.audioNodes.core.pause()
        }
        setIsPlaying(!isPlaying)
      }}>{isPlaying ? 'Pause' : 'Play'}</button>

      <h3 style={{ marginBottom: 0 }}
      >Distortion</h3>
      <div>
        <label>Input Gain
          <input type="range" min="0" max="10" step="0.01" defaultValue="0.1"
            onChange={e => window.audioNodes.dist.setGain(+e.target.value)} />
        </label>
        <label>Output Volumn
          <input type="range" min="0" max="0.6" step="0.01" defaultValue="0.3"
            onChange={e => window.audioNodes.dist.setVolumn(+e.target.value)} />
        </label>
      </div>

      <h3 style={{ marginBottom: 0 }}>Equalizer</h3>
      <div>
        <label>Low
          <input type="range" min="-40" max="40" step="1" defaultValue="0"
            onChange={e => updateEQ('low', +e.target.value)} />
        </label>
        <label>Mid
          <input type="range" min="-40" max="40" step="1" defaultValue="0"
            onChange={e => updateEQ('mid', +e.target.value)} />
        </label>
        <label>High
          <input type="range" min="-40" max="40" step="1" defaultValue="0"
            onChange={e => updateEQ('high', +e.target.value)} />
        </label>
      </div>

      <h3 style={{ marginBottom: 0 }}>Reverb</h3>
      <div>
        <label>Dry/Wet
          <input type="range" min="0" max="1" step="0.01" defaultValue="0"
            onChange={e => window.audioNodes.reverb.setDryWet(+e.target.value)} />
        </label>
      </div>

      <h3 style={{ marginBottom: 0 }}>Analyser</h3>
      <h4 style={{ marginBottom: 0 }}>Time Domain</h4>
      <canvas ref={timeCanvasRef} width={300} height={100} style={{ marginTop: 20, border: '1px solid #ccc' }} />
      <h4 style={{ marginBottom: 0 }}>Frequency Domain</h4>
      <canvas ref={freqCanvasRef} width={300} height={100} style={{ marginTop: 20, border: '1px solid #ccc' }} />

    </div>
  )
}

export default App

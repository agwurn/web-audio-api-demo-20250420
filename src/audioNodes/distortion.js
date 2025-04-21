export function createDistortion(ctx) {
  const input = ctx.createGain()
  const output = ctx.createGain()

  input.gain.value = 0.1
  output.gain.value = 0.3

  const distortionNode = ctx.createWaveShaper()

  input.connect(distortionNode)
  distortionNode.connect(output)

  // example formula for distortion
  function makeCurve() {
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1

      // tanh curve to simulate soft clip overdrive
      curve[i] = Math.tanh(5 * x)
    }
    return curve
  }

  distortionNode.curve = makeCurve()

  return {
    input,
    connect: (node) => output.connect(node.input || node),
    setGain: (val) => input.gain.setValueAtTime(val, ctx.currentTime),
    setVolumn: (val) => {
      output.gain.setValueAtTime(val, ctx.currentTime)
    },
  }
}

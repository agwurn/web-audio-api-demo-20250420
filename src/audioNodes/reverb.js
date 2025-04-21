let impulseBuffer = null
export function createReverb(ctx) {
  const input = ctx.createGain()
  const dry = ctx.createGain()
  const wet = ctx.createGain()

  dry.gain.value = 1
  wet.gain.value = 0

  const convolverNode = ctx.createConvolver() // [1] create a convolver node

  input.connect(dry)
  input.connect(convolverNode)
  convolverNode.connect(wet)

  const output = ctx.createGain()
  dry.connect(output)
  wet.connect(output)

  fetch('Conic Long Echo Hall.wav') // [2] load the impulse response
    .then(res => res.arrayBuffer())
    .then(buf => ctx.decodeAudioData(buf))
    .then(decoded => {
      impulseBuffer = decoded
      convolverNode.buffer = impulseBuffer
    })

  return {
    input,
    connect: (node) => output.connect(node.input || node),
    setDryWet: (val) => {
      dry.gain.value = 1 - val
      wet.gain.value = val
    },
  }
}
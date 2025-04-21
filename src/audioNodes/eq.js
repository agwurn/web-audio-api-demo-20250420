export function createEQ(ctx) {
  const input = ctx.createGain()

  const low = ctx.createBiquadFilter()
  const mid = ctx.createBiquadFilter()
  const high = ctx.createBiquadFilter()

  low.type = 'lowshelf'
  low.frequency.value = 320
  mid.type = 'peaking'
  mid.frequency.value = 1000
  high.type = 'highshelf'
  high.frequency.value = 3200

  input.connect(low)
  low.connect(mid)
  mid.connect(high)

  return {
    input,
    connect: (node) => high.connect(node.input || node),
    setEQ: ({ low: l, mid: m, high: h }) => {
      low.gain.value = l
      mid.gain.value = m
      high.gain.value = h
    },
  }
}
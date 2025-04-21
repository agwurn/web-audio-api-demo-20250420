export function createAudioCore(ctx) {
  /*
   DEMO: select a audio fill
   1. song
   2. sine wave
   3. electric guitar
   4. electric guitar
   5. speech
   */
  // const audio = new Audio('/渣泥ZANI -半心Official Music Video拷貝.mp3') // music demo
  // const audio = new Audio('/sine-wave-440hz-frequency_69bpm_D_minor.wav') // sine wave demo
  // const audio = new Audio('/demo_電吉他_如果我有一天就這樣忘記你了.wav') // electric guitar demo
  // const audio = new Audio('/demo_電吉他2.wav') // electric guitar demo 2
  const audio = new Audio('/demo_講話.wav') // speech demo

  const source = ctx.createMediaElementSource(audio)

  return {
    source,
    connect: (node) => source.connect(node.input || node),
    play: () => audio.play(),
    pause: () => audio.pause(),
  }
}

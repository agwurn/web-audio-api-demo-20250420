export function createAnalyser(ctx, { timeCanvas, freqCanvas }) {

  const analyser = ctx.createAnalyser() // [1] create an analyser node
  analyser.fftSize = 2048 // [2] set the FFT size

  const bufferLength = analyser.frequencyBinCount
  const freqData = new Uint8Array(bufferLength)
  const timeData = new Uint8Array(bufferLength)

  const timeCtx = timeCanvas.getContext('2d')
  const freqCtx = freqCanvas.getContext('2d')

  function draw() {
    requestAnimationFrame(draw)

    analyser.getByteFrequencyData(freqData) // [3-a] get frequency data into freqData
    analyser.getByteTimeDomainData(timeData) // [3-b] get time domain data into timeData

    const { width, height } = freqCanvas

    // Draw Time domain graph
    timeCtx.clearRect(0, 0, width, height)
    timeCtx.beginPath()
    timeCtx.strokeStyle = '#f60'
    timeCtx.lineWidth = 2
    for (let i = 0; i < bufferLength; i++) {
      const x = (i / bufferLength) * width
      const y = (timeData[i] / 255) * height
      if (i === 0) timeCtx.moveTo(x, y)
      else timeCtx.lineTo(x, y)
    }
    timeCtx.stroke()

    // Draw Frequency domain graph (log scale)
    const minHz = 20
    const maxHz = ctx.sampleRate / 2
    const logMin = Math.log10(minHz)
    const logMax = Math.log10(maxHz)

    function getLogX(index, width) {
      const freq = index * ctx.sampleRate / analyser.fftSize
      const logFreq = Math.log10(freq)
      const norm = (logFreq - logMin) / (logMax - logMin)
      return norm * width
    }

    freqCtx.clearRect(0, 0, width, height)
    freqCtx.fillStyle = '#0cf'
    for (let i = 1; i < bufferLength; i++) {
      const barHeight = (freqData[i] / 255) * height
      const x = getLogX(i, width)
      freqCtx.fillRect(x, height - barHeight, 2, barHeight)
    }
  }

  draw()
  return analyser
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function useSwipeSounds() {
  function playWhoosh(): void {
    if (typeof window === 'undefined') return
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3)

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length)
    }
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(2000, now)
    lowpass.frequency.exponentialRampToValueAtTime(200, now + 0.3)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.12, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.15, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(lowpass)
    lowpass.connect(oscGain)
    oscGain.connect(ctx.destination)

    noiseSource.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
    noiseSource.start(now)
    noiseSource.stop(now + 0.15)
  }

  function playChime(): void {
    if (typeof window === 'undefined') return
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const frequencies = [523.25, 659.25, 783.99]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq

      const gain = ctx.createGain()
      const startTime = now + i * 0.1
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.6)
    })
  }

  return { playWhoosh, playChime }
}

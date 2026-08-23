/**
 * Ambient Japanese Zen Soundscapes synthesized with the Web Audio API.
 * No external audio files needed — instant, lightweight, and calming.
 */

let audioCtx = null
let activeSoundType = null
let soundIntervals = []
let masterGain = null

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      audioCtx = new AudioContext()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function isAudioSupported() {
  return typeof window !== 'undefined' && (!!window.AudioContext || !!window.webkitAudioContext)
}

// 1. Zen Temple Gong / Singing Bowl
function playTempleBell(ctx, destination) {
  const now = ctx.currentTime
  const fundamental = 174 // Hz (Solfeggio healing frequency / traditional bronze temple bell)

  const partials = [
    { freqMult: 1.0, gain: 0.7, decay: 4.5 },
    { freqMult: 2.76, gain: 0.35, decay: 3.2 },
    { freqMult: 5.4, gain: 0.18, decay: 2.0 },
    { freqMult: 8.9, gain: 0.08, decay: 1.2 },
  ]

  partials.forEach(({ freqMult, gain, decay }) => {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(fundamental * freqMult, now)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.03)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay)

    osc.connect(gainNode)
    gainNode.connect(destination)

    osc.start(now)
    osc.stop(now + decay + 0.1)
  })
}

// 2. Bamboo Water Drop / Shishi-odoshi
function playBambooDrop(ctx, destination) {
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()

  // Pitch envelope dropping slightly
  osc.type = 'sine'
  osc.frequency.setValueAtTime(540 + Math.random() * 80, now)
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.15)

  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

  osc.connect(gainNode)
  gainNode.connect(destination)

  osc.start(now)
  osc.stop(now + 0.4)
}

// 3. Furin (Japanese Glass Wind Chime)
function playWindChime(ctx, destination) {
  const now = ctx.currentTime
  const notes = [1318.51, 1567.98, 1760.0, 2093.0, 2637.02] // E6, G6, A6, C7, E7
  const baseFreq = notes[Math.floor(Math.random() * notes.length)]

  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(baseFreq, now)

  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(0.25, now + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)

  osc.connect(gainNode)
  gainNode.connect(destination)

  osc.start(now)
  osc.stop(now + 2.0)
}

// 4. Kyoto Rain (Continuous Pink Noise filter)
let rainSource = null
function startRain(ctx, destination) {
  const bufferSize = ctx.sampleRate * 2
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const output = noiseBuffer.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035
    b6 = white * 0.115926
  }

  const whiteNoise = ctx.createBufferSource()
  whiteNoise.buffer = noiseBuffer
  whiteNoise.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1000

  const gain = ctx.createGain()
  gain.gain.value = 0.18

  whiteNoise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)

  whiteNoise.start(0)
  rainSource = whiteNoise
}

export function startSoundscape(type = 'zen-temple', volume = 0.5) {
  stopSoundscape()
  const ctx = getAudioContext()
  if (!ctx) return false

  masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(volume * 0.6, ctx.currentTime)
  masterGain.connect(ctx.destination)

  activeSoundType = type

  if (type === 'zen-temple') {
    playTempleBell(ctx, masterGain)
    const interval = setInterval(() => {
      if (activeSoundType === 'zen-temple') {
        playTempleBell(ctx, masterGain)
      }
    }, 4800)
    soundIntervals.push(interval)
  } else if (type === 'bamboo-water') {
    playBambooDrop(ctx, masterGain)
    const interval = setInterval(() => {
      if (activeSoundType === 'bamboo-water') {
        playBambooDrop(ctx, masterGain)
        if (Math.random() > 0.6) {
          setTimeout(() => playBambooDrop(ctx, masterGain), 200)
        }
      }
    }, 2800)
    soundIntervals.push(interval)
  } else if (type === 'summer-furin') {
    playWindChime(ctx, masterGain)
    const interval = setInterval(() => {
      if (activeSoundType === 'summer-furin') {
        playWindChime(ctx, masterGain)
        if (Math.random() > 0.4) {
          setTimeout(() => playWindChime(ctx, masterGain), 250)
        }
      }
    }, 2200)
    soundIntervals.push(interval)
  } else if (type === 'kyoto-rain') {
    startRain(ctx, masterGain)
  }

  return true
}

export function setSoundVolume(volume) {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(volume * 0.6, audioCtx.currentTime)
  }
}

export function stopSoundscape() {
  soundIntervals.forEach((id) => clearInterval(id))
  soundIntervals = []

  if (rainSource) {
    try {
      rainSource.stop()
      rainSource.disconnect()
    } catch {
      // Ignore if already stopped
    }
    rainSource = null
  }

  activeSoundType = null
}

export function getActiveSoundType() {
  return activeSoundType
}

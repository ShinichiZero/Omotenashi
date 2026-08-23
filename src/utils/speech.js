/**
 * Web Speech API helper for authentic Japanese pronunciation
 */

let japaneseVoice = null

function getJapaneseVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  if (japaneseVoice) return japaneseVoice

  const voices = window.speechSynthesis.getVoices()
  japaneseVoice = voices.find(
    (v) => v.lang.startsWith('ja') || v.lang === 'ja_JP' || v.name.toLowerCase().includes('japanese') || v.name.toLowerCase().includes('kyoko') || v.name.toLowerCase().includes('otoya'),
  ) || voices.find((v) => v.lang.includes('ja'))

  return japaneseVoice
}

// Pre-load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      getJapaneseVoice()
    }
  }
}

export function speakJapanese(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis is not supported in this browser.')
    return false
  }

  try {
    window.speechSynthesis.cancel() // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text)
    const voice = getJapaneseVoice()

    utterance.lang = 'ja-JP'
    if (voice) {
      utterance.voice = voice
    }
    utterance.rate = 0.9 // Slightly calmer pace for learners
    utterance.pitch = 1.0

    if (onEnd) {
      utterance.onend = onEnd
      utterance.onerror = onEnd
    }

    window.speechSynthesis.speak(utterance)
    return true
  } catch (error) {
    console.error('Speech error:', error)
    if (onEnd) onEnd()
    return false
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

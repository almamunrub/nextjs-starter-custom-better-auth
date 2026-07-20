import { useEffect, useRef, useState } from 'react'

export function useResendCountdown(initialSeconds = 120) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => setSecondsLeft(initialSeconds)

  useEffect(() => {
    if (secondsLeft <= 0) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => prev - 1)
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [secondsLeft])

  return { secondsLeft, canResend: secondsLeft <= 0, start }
}

export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { ExternalLink, Copy, Check, Gift, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const COUNTDOWN_SECONDS = 10

interface VoucherCardProps {
  voucherCode: string
  googleUrl: string
  onReset: () => void
}

export default function VoucherCard({
  voucherCode,
  googleUrl,
  onReset,
}: VoucherCardProps) {
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS)
  const [timerStarted, setTimerStarted] = useState(false)
  const [showVoucher, setShowVoucher] = useState(false)
  const [copied, setCopied] = useState(false)

  const revealVoucher = useCallback(() => {
    setProgress(100)
    setTimeLeft(0)
    setShowVoucher(true)
  }, [])

  useEffect(() => {
    if (!timerStarted) return

    const duration = COUNTDOWN_SECONDS * 1000
    const startTime = Date.now()

    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / duration) * 100, 100)
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000))

      setProgress(pct)
      setTimeLeft(remaining)

      if (elapsed >= duration) {
        clearInterval(tick)
        revealVoucher()
      }
    }, 50)

    return () => clearInterval(tick)
  }, [timerStarted, revealVoucher])

  const handleGoogleClick = () => {
    window.open(googleUrl || "#", "_blank", "noopener,noreferrer")
    if (!timerStarted) setTimerStarted(true)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucherCode)
    } catch {
      // code is visible on screen — user can copy manually
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5 w-full">
      {/* Header */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <div className="flex justify-center gap-0.5 sm:gap-1 text-2xl sm:text-3xl select-none">
          {"⭐".repeat(5)}
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          You&apos;re Incredible!
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
          Perfect rating! Share your experience to help others discover us.
        </p>
      </div>

      {/* Google Review CTA — hidden once voucher is revealed */}
      {!showVoucher && (
        <Button
          size="lg"
          onClick={handleGoogleClick}
          className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black shadow-lg shadow-amber-500/20 transition-all"
        >
          <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Post on Google Reviews
        </Button>
      )}

      {/* Countdown — collapses after voucher reveals */}
      <div
        className={cn(
          "w-full overflow-hidden transition-all duration-700 ease-in-out",
          showVoucher ? "max-h-0 opacity-0 pointer-events-none" : "max-h-48 opacity-100"
        )}
      >
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="pt-4 pb-4 sm:pt-5 sm:pb-5 space-y-3">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-zinc-400">Your voucher unlocks in</span>
              <span className="font-mono font-bold text-amber-400 text-lg sm:text-xl tabular-nums">
                {timeLeft}s
              </span>
            </div>
            <Progress value={progress} className="h-2.5 sm:h-3 bg-zinc-800" />
            <p className="text-xs sm:text-sm text-zinc-500 text-center">
              🎁 A special reward is preparing for you…
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Voucher — slides in after countdown */}
      <div
        className={cn(
          "w-full transition-all duration-700 ease-out",
          showVoucher
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        )}
      >
        <Card className="border-amber-500/30 bg-gradient-to-b from-amber-950/40 to-zinc-950/60 shadow-xl shadow-amber-900/20">
          <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 space-y-4 sm:space-y-5">
            {/* Label */}
            <div className="flex items-center gap-2 text-amber-400">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Your Exclusive Reward
              </span>
            </div>

            {/* Code display */}
            <div className="rounded-xl bg-zinc-950/70 border border-amber-500/20 p-4 sm:p-5 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
                Voucher Code
              </p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-amber-400 tracking-[0.2em] sm:tracking-[0.25em]">
                {voucherCode}
              </p>
            </div>

            {/* Copy button */}
            <Button
              onClick={handleCopy}
              variant="outline"
              className={cn(
                "w-full h-11 sm:h-12 text-sm sm:text-base font-semibold transition-all",
                copied
                  ? "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/15"
                  : "border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
              )}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied to clipboard!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Voucher Code
                </>
              )}
            </Button>

            <p className="text-xs sm:text-sm text-zinc-500 text-center leading-relaxed">
              Present this code on your next visit to redeem your discount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rate again */}
      {showVoucher && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
        >
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
          Rate again
        </button>
      )}
    </div>
  )
}

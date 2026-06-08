"use client"

import { useState } from "react"
import Image from "next/image"
import SpinWheel from "@/components/SpinWheel"
import VoucherCard from "@/components/VoucherCard"
import { SEGMENTS } from "@/lib/segments"

type AppState = "idle" | "spinning" | "result"

type SpinResult = {
  segmentIndex: number
  reward: string
  rewardEmoji: string
  voucherCode: string
  googleUrl: string
}

export default function Home() {
  const [appState, setAppState]     = useState<AppState>("idle")
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const handleTap = async () => {
    if (loading || appState !== "idle") return
    setLoading(true)
    setError(null)

    const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL

    // Open a window SYNCHRONOUSLY — this is within the user gesture so popup
    // blockers never trigger. We show a holding screen, then navigate it to
    // Google 2 s later once the wheel is visibly spinning.
    let reviewWin: Window | null = null
    if (googleUrl) {
      reviewWin = window.open("", "_blank")
      if (reviewWin) {
        reviewWin.document.documentElement.innerHTML = `
          <head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
          <body style="margin:0;background:#000;color:#fff;font-family:sans-serif;
                       display:flex;align-items:center;justify-content:center;
                       height:100vh;text-align:center;">
            <div>
              <div style="font-size:3rem;margin-bottom:1rem">🎡</div>
              <p style="font-size:1.1rem;font-weight:700;margin:0">Your wheel is spinning…</p>
              <p style="font-size:.85rem;color:#aaa;margin:.5rem 0 0">Redirecting to Google Reviews shortly</p>
            </div>
          </body>`
      }
    }

    try {
      const res = await fetch("/api/submit-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spin: true }),
      })
      if (!res.ok) throw new Error("Server error")

      const data: SpinResult = await res.json()
      setSpinResult(data)
      setAppState("spinning")

      // Navigate the already-open window to Google after 2 s
      if (reviewWin && googleUrl) {
        setTimeout(() => { reviewWin!.location.href = googleUrl }, 2000)
      }
    } catch {
      reviewWin?.close()
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSpinComplete = () => setAppState("result")

  const handleReset = () => {
    setAppState("idle")
    setSpinResult(null)
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* Brand header */}
      <div className="mb-6 sm:mb-8 text-center animate-in fade-in duration-500">
        <Image
          src="/creams.png"
          alt="Creams Cafe"
          width={220}
          height={90}
          className="mx-auto h-14 sm:h-16 lg:h-20 w-auto object-contain"
          priority
        />
        <p className="text-pink-400 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mt-2">
          Brighton
        </p>
      </div>

      {/* Content card */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="sm:bg-zinc-950/60 sm:border sm:border-zinc-800/60 sm:rounded-2xl sm:p-8 lg:p-10">

          {/* Idle / spinning: show wheel */}
          {(appState === "idle" || appState === "spinning") && (
            <div className="flex flex-col items-center gap-5 sm:gap-6 animate-in fade-in duration-400">

              {/* Heading */}
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
                  Spin to Win!
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base leading-snug">
                  Tap the wheel to reveal your reward
                </p>
              </div>

              {/* Wheel */}
              <SpinWheel
                segments={SEGMENTS}
                targetIndex={spinResult?.segmentIndex ?? null}
                spinDuration={11}
                onTap={handleTap}
                onComplete={handleSpinComplete}
                disabled={loading}
              />

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              {/* Instruction shown while wheel is spinning */}
              {appState === "spinning" && (
                <p className="text-xs sm:text-sm text-zinc-400 text-center animate-in fade-in duration-500">
                  Google Reviews is opening — post your review and come back for your reward! 🎁
                </p>
              )}
            </div>
          )}

          {/* Result: show voucher */}
          {appState === "result" && spinResult && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <VoucherCard
                reward={spinResult.reward}
                rewardEmoji={spinResult.rewardEmoji}
                voucherCode={spinResult.voucherCode}
                onReset={handleReset}
              />
            </div>
          )}

        </div>
      </div>

      <footer className="mt-10 text-xs text-zinc-700 text-center uppercase tracking-widest">
        © {new Date().getFullYear()} Creams Cafe Brighton
      </footer>
    </main>
  )
}

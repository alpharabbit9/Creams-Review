"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Gift, Copy, Check } from "lucide-react"
import SpinWheel from "@/components/SpinWheel"
import VoucherCard from "@/components/VoucherCard"
import { SEGMENTS } from "@/lib/segments"
import { cn } from "@/lib/utils"

const LS_CLAIMED   = "creams_claimed"
const LS_SESSION   = "creams_session_id"
const LS_RESULT    = "creams_result"

type AppState = "checking" | "idle" | "spinning" | "result" | "claimed"

type SpinResult = {
  segmentIndex: number
  reward:       string
  rewardEmoji:  string
  voucherCode:  string
  googleUrl:    string
}

export default function Home() {
  const [appState,   setAppState]   = useState<AppState>("checking")
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null)
  const [sessionId,  setSessionId]  = useState<string | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [copied,     setCopied]     = useState(false)

  // ── Session init + claimed check ───────────────────────────────
  useEffect(() => {
    // Option A: localStorage claimed flag (instant)
    if (localStorage.getItem(LS_CLAIMED) === "true") {
      const stored = localStorage.getItem(LS_RESULT)
      if (stored) setSpinResult(JSON.parse(stored))
      setAppState("claimed")
      return
    }

    // Get or create session ID
    let sid = localStorage.getItem(LS_SESSION)
    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem(LS_SESSION, sid)
    }
    setSessionId(sid)

    // Option B: server check (catches edge case where claimed flag was wiped
    // but MongoDB still has this session marked as used)
    fetch(`/api/session/check?id=${encodeURIComponent(sid)}`)
      .then(r => r.json())
      .then(({ used }: { used: boolean }) => {
        if (used) {
          localStorage.setItem(LS_CLAIMED, "true")
          setAppState("claimed")
        } else {
          setAppState("idle")
        }
      })
      .catch(() => setAppState("idle")) // fail open — let them spin if check fails
  }, [])

  // ── Spin handler ───────────────────────────────────────────────
  const handleTap = async () => {
    if (loading || appState !== "idle") return
    setLoading(true)
    setError(null)

    const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
    if (googleUrl) {
      window.open(googleUrl, "_blank", "noopener,noreferrer")
    }

    try {
      const res = await fetch("/api/submit-rating", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ spin: true, sessionId }),
      })

      if (res.status === 403) {
        // Race condition: already claimed on another device/tab
        localStorage.setItem(LS_CLAIMED, "true")
        setAppState("claimed")
        return
      }
      if (!res.ok) throw new Error("Server error")

      const data: SpinResult = await res.json()
      setSpinResult(data)

      // Lock the session in localStorage right away
      localStorage.setItem(LS_CLAIMED, "true")
      localStorage.setItem(LS_RESULT,  JSON.stringify(data))

      setAppState("spinning")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSpinComplete = () => setAppState("result")

  const handleCopyCode = async (code: string) => {
    try { await navigator.clipboard.writeText(code) } catch { /* visible on screen */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // ── Render ─────────────────────────────────────────────────────
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

      {/* Content */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="sm:bg-zinc-950/60 sm:border sm:border-zinc-800/60 sm:rounded-2xl sm:p-8 lg:p-10">

          {/* ── Checking state (brief server verify) ── */}
          {appState === "checking" && (
            <div className="flex flex-col items-center gap-3 py-16 animate-in fade-in duration-300">
              <div className="h-8 w-8 rounded-full border-2 border-pink-500/30 border-t-pink-400 animate-spin" />
            </div>
          )}

          {/* ── Idle / Spinning: show wheel ── */}
          {(appState === "idle" || appState === "spinning") && (
            <div className="flex flex-col items-center gap-5 sm:gap-6 animate-in fade-in duration-400">
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
                  Spin to Win!
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base leading-snug">
                  Tap the wheel to reveal your reward
                </p>
              </div>

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

              {appState === "spinning" && (
                <p className="text-xs sm:text-sm text-zinc-400 text-center animate-in fade-in duration-500">
                  Google Reviews is opening — post your review and come back for your reward! 🎁
                </p>
              )}
            </div>
          )}

          {/* ── Result: show voucher ── */}
          {appState === "result" && spinResult && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <VoucherCard
                reward={spinResult.reward}
                rewardEmoji={spinResult.rewardEmoji}
                voucherCode={spinResult.voucherCode}
                onReset={() => {}} // disabled — no re-spin
              />
            </div>
          )}

          {/* ── Already claimed ── */}
          {appState === "claimed" && (
            <div className="flex flex-col items-center gap-5 sm:gap-6 animate-in fade-in duration-500 text-center">
              <div className="text-5xl sm:text-6xl select-none">🎟️</div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Already Claimed!
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-xs mx-auto">
                  You&apos;ve already spun the wheel. Each customer gets one spin.
                </p>
              </div>

              {/* Show their code again if we have it */}
              {spinResult?.voucherCode && (
                <div className="w-full rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-600/10 border border-pink-500/30 px-5 py-5">
                  <p className="text-xs text-pink-400/70 uppercase tracking-widest mb-1 font-bold">
                    Your Reward
                  </p>
                  <p className="text-lg sm:text-xl font-black text-white mb-4">
                    {spinResult.rewardEmoji} {spinResult.reward}
                  </p>

                  <div className="rounded-xl bg-black border border-pink-500/20 p-4 mb-3 overflow-hidden">
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
                      Redemption Code
                    </p>
                    <p className="text-xl sm:text-2xl font-mono font-black text-pink-400 tracking-wide break-all">
                      {spinResult.voucherCode}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(spinResult.voucherCode)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-bold uppercase tracking-wide border transition-all",
                      copied
                        ? "border-green-500/40 bg-green-500/10 text-green-400"
                        : "border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20",
                    )}
                  >
                    {copied
                      ? <><Check className="h-4 w-4" />Copied!</>
                      : <><Copy className="h-4 w-4" />Copy Code</>
                    }
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-zinc-500 text-xs sm:text-sm">
                <Gift className="h-4 w-4 flex-shrink-0" />
                <span>Show your code at the counter to redeem</span>
              </div>
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

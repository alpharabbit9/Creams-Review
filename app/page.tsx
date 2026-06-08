"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import StarRating from "@/components/StarRating"
import VoucherCard from "@/components/VoucherCard"
import QuoteCard from "@/components/QuoteCard"

type AppState = "idle" | "loading" | "result"

type RatingResult = {
  type: "voucher" | "quote"
  voucherCode?: string
  googleUrl?: string
  quote?: string
}

export default function Home() {
  const [state, setState] = useState<AppState>("idle")
  const [selectedRating, setSelectedRating] = useState(0)
  const [result, setResult] = useState<RatingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRating = async (rating: number) => {
    setSelectedRating(rating)
    setState("loading")
    setError(null)

    try {
      const res = await fetch("/api/submit-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      })

      if (!res.ok) throw new Error("Server error")

      const data: RatingResult = await res.json()
      setResult(data)
      setState("result")
    } catch {
      setError("Something went wrong. Please try again.")
      setState("idle")
    }
  }

  const handleReset = () => {
    setState("idle")
    setResult(null)
    setSelectedRating(0)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Brand header */}
      <div className="mb-8 sm:mb-10 text-center animate-in fade-in duration-500">
        <div className="text-5xl sm:text-6xl mb-2 sm:mb-3 select-none">🍦</div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
          Creams Cafe
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">Brighton</p>
      </div>

      {/* Content card — looks intentional on desktop */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="sm:bg-zinc-900/40 sm:border sm:border-zinc-800 sm:rounded-2xl sm:p-8 lg:p-10">

          {state === "idle" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
              <StarRating onRate={handleRating} />
              {error && (
                <p className="mt-4 text-center text-sm text-destructive">{error}</p>
              )}
            </div>
          )}

          {state === "loading" && (
            <div className="flex flex-col items-center gap-4 py-10 sm:py-12 animate-in fade-in duration-300">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-amber-400" />
              <p className="text-zinc-400 text-sm sm:text-base">Saving your rating…</p>
            </div>
          )}

          {state === "result" && result?.type === "voucher" && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <VoucherCard
                voucherCode={result.voucherCode!}
                googleUrl={result.googleUrl!}
                onReset={handleReset}
              />
            </div>
          )}

          {state === "result" && result?.type === "quote" && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <QuoteCard
                quote={result.quote!}
                rating={selectedRating}
                onReset={handleReset}
              />
            </div>
          )}

        </div>
      </div>

      <footer className="mt-10 sm:mt-12 text-xs text-zinc-600 text-center">
        © {new Date().getFullYear()} Creams Dessert Shop
      </footer>
    </main>
  )
}

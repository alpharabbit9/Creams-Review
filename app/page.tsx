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
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Brand header */}
      <div className="mb-10 text-center animate-in fade-in duration-500">
        <div className="text-6xl mb-3 select-none">🍦</div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Creams Cafe </h1>
        <p className="text-zinc-400 text-sm mt-1">Brighton</p>
      </div>

      <div className="w-full max-w-sm">
        {state === "idle" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
            <StarRating onRate={handleRating} />
            {error && (
              <p className="mt-4 text-center text-sm text-destructive">{error}</p>
            )}
          </div>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in duration-300">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            <p className="text-zinc-400 text-sm">Saving your rating…</p>
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

      <footer className="mt-12 text-xs text-zinc-600 text-center">
        © {new Date().getFullYear()} Creams Dessert Shop
      </footer>
    </main>
  )
}

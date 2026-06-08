"use client"

import { Heart, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuoteCardProps {
  quote: string
  rating: number
  onReset: () => void
}

export default function QuoteCard({ quote, rating, onReset }: QuoteCardProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Stars + heading */}
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-8 h-8 transition-colors",
                i < rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-800 text-zinc-700"
              )}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white">Thank You!</h2>
        <p className="text-zinc-400 text-sm">
          Your honest feedback makes us better every single day.
        </p>
      </div>

      {/* Quote card */}
      <Card className="w-full border-zinc-800 bg-zinc-900/60">
        <CardContent className="pt-7 pb-7 space-y-5">
          <div className="flex justify-center">
            <div className="rounded-full bg-rose-500/10 border border-rose-500/20 p-3">
              <Heart className="h-6 w-6 text-rose-400 fill-rose-400" />
            </div>
          </div>

          <p className="text-center text-base text-zinc-200 leading-relaxed font-medium italic">
            &ldquo;{quote}&rdquo;
          </p>

          <div className="border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500 text-center">
              — The Creams Team
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-zinc-600 text-center px-4 leading-relaxed">
        We hope to see you again soon with an even sweeter experience
      </p>

      {/* Rate again */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-1"
      >
        <RefreshCw className="h-3 w-3" />
        Rate again
      </button>
    </div>
  )
}

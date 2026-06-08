"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  onRate: (rating: number) => void
}

export default function StarRating({ onRate }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      {/* Heading */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
          How was your experience?
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base">
          Tap a star to rate us instantly
        </p>
      </div>

      {/* Stars — sized so all 5 fit even on 320px screens */}
      <div
        className="flex gap-1 sm:gap-2 lg:gap-3"
        onMouseLeave={() => setHovered(0)}
        role="group"
        aria-label="Star rating"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= hovered
          return (
            <button
              key={star}
              type="button"
              className={cn(
                "p-1.5 sm:p-2 rounded-full transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                "active:scale-90 touch-manipulation select-none",
                isActive ? "scale-110" : "scale-100"
              )}
              onMouseEnter={() => setHovered(star)}
              onTouchStart={() => setHovered(star)}
              onClick={() => onRate(star)}
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  // w-11 on mobile (44px) keeps 5 stars within 320px; scales up on larger screens
                  "w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 transition-all duration-150 drop-shadow-md",
                  isActive
                    ? "fill-amber-400 text-amber-400"
                    : "fill-zinc-700 text-zinc-600"
                )}
              />
            </button>
          )
        })}
      </div>

      <p className="text-zinc-600 text-xs sm:text-sm">No button needed — just tap</p>
    </div>
  )
}

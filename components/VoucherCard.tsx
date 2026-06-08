"use client"

import { useState } from "react"
import { Copy, Check, Gift, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface VoucherCardProps {
  reward: string
  rewardEmoji: string
  voucherCode: string
  onReset: () => void
}

export default function VoucherCard({
  reward,
  rewardEmoji,
  voucherCode,
  onReset,
}: VoucherCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucherCode)
    } catch {
      // code visible on screen — user can copy manually
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">

      {/* Header */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <div className="text-5xl sm:text-6xl select-none animate-in zoom-in duration-500">
          {rewardEmoji}
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
          You Won!
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
          Congratulations — here&apos;s your exclusive reward
        </p>
      </div>

      {/* Reward banner */}
      <div className="w-full rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-600/10 border border-pink-500/30 px-5 py-4 sm:py-5 text-center">
        <p className="text-xs text-pink-400/70 uppercase tracking-widest mb-1 font-bold">
          Your Prize
        </p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
          {rewardEmoji} {reward}
        </p>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">Valid on your next visit</p>
      </div>

      {/* Voucher code card */}
      <Card className="w-full border-zinc-800/60 bg-zinc-950/70">
        <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 text-pink-400">
            <Gift className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Redemption Code
            </span>
          </div>

          {/* Code display */}
          <div className="rounded-xl bg-black border border-pink-500/20 p-4 sm:p-5 text-center overflow-hidden">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
              Show this code at the counter
            </p>
            <p className="text-xl sm:text-3xl lg:text-4xl font-mono font-black text-pink-400 tracking-wide sm:tracking-widest break-all">
              {voucherCode}
            </p>
          </div>

          {/* Copy button */}
          <Button
            onClick={handleCopy}
            variant="outline"
            className={cn(
              "w-full h-11 sm:h-12 text-sm sm:text-base font-bold uppercase tracking-wide transition-all",
              copied
                ? "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/15"
                : "border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/60",
            )}
          >
            {copied ? (
              <><Check className="mr-2 h-4 w-4" />Copied!</>
            ) : (
              <><Copy className="mr-2 h-4 w-4" />Copy Code</>
            )}
          </Button>

          <p className="text-xs sm:text-sm text-zinc-500 text-center leading-relaxed">
            Present this code on your next visit to redeem your reward
          </p>
        </CardContent>
      </Card>

      {/* Spin again */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
        Spin again
      </button>
    </div>
  )
}

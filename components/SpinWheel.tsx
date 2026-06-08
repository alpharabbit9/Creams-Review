"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import type { Segment } from "@/lib/segments"

/* ── SVG geometry ───────────────────────────────────────────── */
const CX = 150, CY = 150, R = 132, INNER_R = 45
const toRad = (d: number) => (d * Math.PI) / 180

function buildPath(n: number, i: number) {
  const a = 360 / n
  const s = -90 + i * a
  const e = s + a
  const x1 = CX + R * Math.cos(toRad(s))
  const y1 = CY + R * Math.sin(toRad(s))
  const x2 = CX + R * Math.cos(toRad(e))
  const y2 = CY + R * Math.sin(toRad(e))
  return `M${CX},${CY} L${x1},${y1} A${R},${R},0,0,1,${x2},${y2} Z`
}

function midPoint(n: number, i: number, radius: number) {
  const a = 360 / n
  const mid = -90 + i * a + a / 2
  return { x: CX + radius * Math.cos(toRad(mid)), y: CY + radius * Math.sin(toRad(mid)), mid }
}

/* ── component ──────────────────────────────────────────────── */
interface Props {
  segments: Segment[]
  targetIndex: number | null
  spinDuration?: number
  onTap: () => void
  onComplete: () => void
  disabled?: boolean
}

export default function SpinWheel({
  segments,
  targetIndex,
  spinDuration = 11,
  onTap,
  onComplete,
  disabled = false,
}: Props) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const hasSpun = useRef(false)

  useEffect(() => {
    if (targetIndex === null || hasSpun.current) return
    hasSpun.current = true
    setSpinning(true)

    const n      = segments.length
    const seg    = 360 / n
    const jitter = (Math.random() * 2 - 1) * seg * 0.28
    const base   = ((330 - targetIndex * seg) % 360 + 360) % 360
    setRotation(8 * 360 + base + jitter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIndex])

  const btnPct = `${((INNER_R * 2) / 300) * 100}%`

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* pointer arrow — brand pink */}
      <div
        aria-hidden
        style={{
          width: 0, height: 0,
          borderLeft:  "13px solid transparent",
          borderRight: "13px solid transparent",
          borderTop:   "24px solid #ec4899",
          filter: "drop-shadow(0 3px 10px rgba(236,72,153,0.8))",
          marginBottom: "-3px",
          zIndex: 10,
          position: "relative",
        }}
      />

      {/* wheel + overlay button */}
      <div
        className="relative mx-auto aspect-square w-full"
        style={{ maxWidth: "clamp(260px, 80vw, 360px)" }}
      >
        {/* rotating wrapper */}
        <div
          className="w-full h-full"
          style={{
            transformOrigin: "center center",
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${spinDuration}s cubic-bezier(0.17, 0.67, 0.12, 0.99)`
              : "none",
          }}
          onTransitionEnd={() => {
            if (spinning) {
              setSpinning(false)
              onComplete()
            }
          }}
        >
          <svg
            viewBox="0 0 300 300"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <radialGradient id="capGrad" cx="38%" cy="32%">
                <stop offset="0%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#09090b" />
              </radialGradient>
            </defs>

            {/* outer shadow ring */}
            <circle cx={CX} cy={CY} r={R + 6} fill="#000" opacity="0.5" />
            {/* outer rim — subtle pink glow ring */}
            <circle cx={CX} cy={CY} r={R + 3} fill="#1a0010" />

            {/* segments */}
            {segments.map((seg, i) => {
              const { x: lx, y: ly, mid } = midPoint(segments.length, i, 83)
              const { x: ex, y: ey }       = midPoint(segments.length, i, 112)
              const rot = mid + 90
              return (
                <g key={i}>
                  <path d={buildPath(segments.length, i)} fill={seg.color} />
                  <path
                    d={buildPath(segments.length, i)}
                    fill="none"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="2"
                  />
                  <text
                    x={ex} y={ey}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="15"
                    transform={`rotate(${rot},${ex},${ey})`}
                  >{seg.emoji}</text>
                  <text
                    x={lx} y={ly - 6}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9.5" fontWeight="800" fill="white"
                    transform={`rotate(${rot},${lx},${ly})`}
                  >{seg.label}</text>
                  <text
                    x={lx} y={ly + 7}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="7.5" fontWeight="600"
                    fill="rgba(255,255,255,0.85)"
                    transform={`rotate(${rot},${lx},${ly})`}
                  >{seg.sublabel}</text>
                </g>
              )
            })}

            {/* centre cap */}
            <circle cx={CX} cy={CY} r={INNER_R + 4} fill="#000" opacity="0.4" />
            <circle cx={CX} cy={CY} r={INNER_R + 2} fill="#0a0010" />
            <circle cx={CX} cy={CY} r={INNER_R}     fill="url(#capGrad)" />
          </svg>
        </div>

        {/* static centre button — does NOT rotate */}
        <button
          onClick={onTap}
          disabled={disabled || spinning}
          aria-label="Tap to spin the wheel"
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "rounded-full flex flex-col items-center justify-center gap-0",
            "border border-pink-700/60 bg-transparent",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400",
            "transition-transform duration-150",
            spinning || disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-pink-500/80 active:scale-95",
          )}
          style={{ width: btnPct, height: btnPct }}
        >
          {spinning ? (
            <span className="text-pink-400 font-black uppercase tracking-wide text-center leading-tight px-1"
              style={{ fontSize: "clamp(7px, 2vw, 9px)" }}>
              Spinning…
            </span>
          ) : (
            <>
              <span className="text-zinc-300 font-black uppercase leading-none"
                style={{ fontSize: "clamp(8px, 2.2vw, 10px)" }}>
                TAP TO
              </span>
              <span className="text-pink-400 font-black uppercase leading-none"
                style={{ fontSize: "clamp(11px, 3vw, 14px)" }}>
                RATE
              </span>
            </>
          )}
        </button>
      </div>

      {/* ambient glow while spinning */}
      {spinning && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-pink-600/10 blur-3xl animate-pulse"
          style={{ width: "clamp(260px,80vw,360px)", aspectRatio: "1", top: "auto" }}
        />
      )}
    </div>
  )
}

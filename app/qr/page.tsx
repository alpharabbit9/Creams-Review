"use client"

import { useEffect, useRef, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Copy, Check, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function useQrSize() {
  const [size, setSize] = useState(220)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSize(300)
      else if (window.innerWidth >= 640) setSize(260)
      else setSize(220)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return size
}

export default function QRPage() {
  const [url, setUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const qrSize = useQrSize()

  useEffect(() => {
    setUrl(window.location.origin)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* url is shown on screen */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas")
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "creams-review-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  if (!url) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 select-none">🍦</div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          QR Code Generator
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-1">
          Print and display this in your shop
        </p>
      </div>

      {/* Layout: single col on mobile, two cols on md+ */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl">
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 lg:gap-8 gap-4 sm:gap-5">

          {/* QR code card */}
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="pt-6 pb-6 sm:pt-7 sm:pb-7 flex flex-col items-center gap-4 sm:gap-5">
              <div
                ref={canvasRef}
                className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl shadow-black/40"
              >
                <QRCodeCanvas
                  value={url}
                  size={qrSize}
                  bgColor="#ffffff"
                  fgColor="#09090b"
                  level="M"
                />
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 text-center break-all px-2 leading-relaxed">
                {url}
              </p>
            </CardContent>
          </Card>

          {/* Actions + instructions */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleDownload}
                className="w-full h-12 sm:h-14 text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Download QR Code (PNG)
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full h-12 sm:h-14 text-sm sm:text-base border-zinc-700 hover:bg-zinc-800"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-400" />
                    <span className="text-green-400">URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Review URL
                  </>
                )}
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full h-12 sm:h-14 text-sm sm:text-base text-zinc-400 hover:text-white"
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Review Page
                </a>
              </Button>
            </div>

            {/* Instructions */}
            <Card className="border-zinc-800 bg-zinc-900/40 flex-1">
              <CardContent className="pt-5 pb-5 sm:pt-6 sm:pb-6 space-y-3">
                <p className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                  How to use
                </p>
                <ol className="text-sm sm:text-base text-zinc-400 space-y-2 sm:space-y-3 list-decimal list-inside">
                  <li>Download the QR code above</li>
                  <li>Print it on a card, sticker, or poster</li>
                  <li>Place it on your counter or tables</li>
                  <li>Customers scan it to leave a review</li>
                </ol>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Copy, Check, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function QRPage() {
  const [url, setUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Strip the /qr suffix so the code always points at the review page root
    setUrl(window.location.origin)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* fallback omitted — url is shown on screen */
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
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-3 select-none">🍦</div>
        <h1 className="text-2xl font-bold text-white">QR Code Generator</h1>
        <p className="text-zinc-400 text-sm mt-1">Print and display this in your shop</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-5">
        {/* QR code card */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardContent className="pt-7 pb-7 flex flex-col items-center gap-5">
            {/* White background so the QR is scannable when printed */}
            <div
              ref={canvasRef}
              className="bg-white rounded-2xl p-4 shadow-xl shadow-black/40"
            >
              <QRCodeCanvas
                value={url}
                size={220}
                bgColor="#ffffff"
                fgColor="#09090b"
                level="H"
                imageSettings={{
                  src: "/icon.png",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <p className="text-xs text-zinc-400 text-center break-all px-2">{url}</p>

            <div className="flex flex-col gap-3 w-full">
              {/* Download PNG */}
              <Button
                onClick={handleDownload}
                className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code (PNG)
              </Button>

              {/* Copy URL */}
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full h-12 border-zinc-700 hover:bg-zinc-800"
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

              {/* Preview review page */}
              <Button asChild variant="ghost" className="w-full h-12 text-zinc-400 hover:text-white">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Review Page
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-zinc-800 bg-zinc-900/40">
          <CardContent className="pt-5 pb-5 space-y-3">
            <p className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">How to use</p>
            <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
              <li>Download the QR code above</li>
              <li>Print it on a card, sticker, or poster</li>
              <li>Place it on your counter or tables</li>
              <li>Customers scan it to leave a review</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

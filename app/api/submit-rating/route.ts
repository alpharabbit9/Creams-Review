import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Rating from "@/models/Rating"
import Session from "@/models/Session"
import { SEGMENTS, SELECTABLE_SEGMENT_IDS } from "@/lib/segments"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json().catch(() => ({}))
    const sessionId: string | undefined = body?.sessionId

    // Block if this session has already spun
    if (sessionId) {
      const existing = await Session.findOne({ sessionId })
      if (existing?.used) {
        return NextResponse.json({ error: "Already claimed" }, { status: 403 })
      }
    }

    const segmentIndex =
      SELECTABLE_SEGMENT_IDS[Math.floor(Math.random() * SELECTABLE_SEGMENT_IDS.length)]
    const segment   = SEGMENTS[segmentIndex]
    const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? ""

    await Rating.create({
      segmentIndex,
      reward:      segment.label + " " + segment.sublabel,
      voucherCode: segment.voucherCode,
      timestamp:   new Date(),
    })

    // Mark session as used
    if (sessionId) {
      await Session.findOneAndUpdate(
        { sessionId },
        { used: true, usedAt: new Date() },
        { upsert: true },
      )
    }

    return NextResponse.json({
      segmentIndex,
      reward:      segment.label + " " + segment.sublabel,
      rewardEmoji: segment.emoji,
      voucherCode: segment.voucherCode,
      googleUrl,
    })
  } catch (err) {
    console.error("[submit-rating]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Rating from "@/models/Rating"
import { SEGMENTS, SELECTABLE_SEGMENT_IDS } from "@/lib/segments"

export async function POST(_req: NextRequest) {
  try {
    await connectDB()

    const segmentIndex =
      SELECTABLE_SEGMENT_IDS[Math.floor(Math.random() * SELECTABLE_SEGMENT_IDS.length)]
    const segment      = SEGMENTS[segmentIndex]
    const googleUrl    = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? ""

    await Rating.create({
      segmentIndex,
      reward:      segment.label + " " + segment.sublabel,
      voucherCode: segment.voucherCode,
      timestamp:   new Date(),
    })

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

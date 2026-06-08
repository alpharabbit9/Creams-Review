import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Rating from "@/models/Rating"

const QUOTES = [
  "Every experience is a chance to grow stronger together.",
  "Your feedback helps us craft something truly special.",
  "Great things are built one delicious step at a time.",
  "We appreciate your honesty — it makes us better every day.",
  "Thank you for taking a moment to share your thoughts with us.",
  "Every visit is a fresh opportunity to create perfection.",
  "Your experience is the heart of everything we do.",
  "We're always working hard to exceed your sweetest expectations.",
  "Thank you for helping us improve our craft and our flavors.",
  "Your voice shapes the future of every scoop we serve.",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rating = Number(body.rating)

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }

    await connectDB()

    if (rating === 5) {
      const voucherCode = process.env.NEXT_PUBLIC_VOUCHER_CODE ?? "SAVE20"
      const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? ""

      await Rating.create({
        rating,
        voucherClaimed: true,
        voucherCode,
        timestamp: new Date(),
      })

      return NextResponse.json({ type: "voucher", voucherCode, googleUrl })
    }

    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

    await Rating.create({
      rating,
      voucherClaimed: false,
      timestamp: new Date(),
    })

    return NextResponse.json({ type: "quote", quote })
  } catch (err) {
    console.error("[submit-rating]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

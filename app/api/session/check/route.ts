import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Session from "@/models/Session"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ used: false })
  try {
    await connectDB()
    const session = await Session.findOne({ sessionId: id }).lean()
    return NextResponse.json({ used: (session as ISession | null)?.used ?? false })
  } catch {
    return NextResponse.json({ used: false })
  }
}

// Satisfy TypeScript without importing the full Document type
interface ISession { used: boolean }

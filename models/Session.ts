import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ISession extends Document {
  sessionId: string
  used:      boolean
  usedAt?:   Date
}

const SessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true, unique: true },
  used:      { type: Boolean, default: false },
  usedAt:    { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } })

const Session: Model<ISession> =
  mongoose.models.Session ?? mongoose.model<ISession>("Session", SessionSchema)

export default Session

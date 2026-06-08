import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IRating extends Document {
  rating: number
  voucherClaimed: boolean
  voucherCode?: string
  timestamp: Date
}

const RatingSchema = new Schema<IRating>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  voucherClaimed: { type: Boolean, default: false },
  voucherCode: { type: String },
  timestamp: { type: Date, default: () => new Date() },
})

const Rating: Model<IRating> =
  mongoose.models.Rating ??
  mongoose.model<IRating>("Rating", RatingSchema)

export default Rating

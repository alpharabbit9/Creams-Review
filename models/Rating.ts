import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IRating extends Document {
  segmentIndex: number
  reward:       string
  voucherCode:  string
  timestamp:    Date
}

const RatingSchema = new Schema<IRating>({
  segmentIndex: { type: Number, required: true, min: 0 },
  reward:       { type: String, required: true },
  voucherCode:  { type: String, required: true },
  timestamp:    { type: Date, default: () => new Date() },
})

const Rating: Model<IRating> =
  mongoose.models.Rating ?? mongoose.model<IRating>("Rating", RatingSchema)

export default Rating

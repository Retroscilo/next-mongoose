import mongoose from 'mongoose'

export const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    restaurantDescription: {
      type: String,
      trim: true,
      maxLength: 200,
    },
    logo: String,
    activeCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'activeCard',
    },
    QR: {
      color: String,
      logo: String,
      shape: Number,
      frame: Number,
    },
    cards: [ {
      _id: false,
      name: {
        type: String,
        required: true,
      },
      cardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'card',
      },
    } ],
  },
)

export default mongoose.models?.Restaurant || mongoose.model('Restaurant', restaurantSchema)

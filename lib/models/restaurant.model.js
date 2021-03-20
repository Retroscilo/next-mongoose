import mongoose from 'mongoose'

export const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantDescription: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    activeCard: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'activeCard',
    },
    cards: [ {
      _id: false,
      name: {
        type: String,
        required: true,
      },
      cardId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'card',
      },
    } ],
  },
)

export default mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema)

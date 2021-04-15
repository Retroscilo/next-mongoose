import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    prodName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    prodDescription: {
      type: String,
      trim: true,
      maxlength: 140,
    },
    prodPrice: {
      type: String,
      required: true,
      match: /[0-9.,]+/,
      maxLength: 6,
    },
    labels: {
      type: [ String ],
      enum: [ 'homeMade', 'spicy', 'reallySpicy', 'vegan', 'meatFree', 'glutenFree' ],
      default: [ 'homeMade' ],
    },
    photo: {
      type: String,
      trim: true,
    },
  },
)

const categorySchema = new mongoose.Schema(
  {
    catName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 40,
    },
    catDescription: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    products: [ productSchema ],
  },
)

export const cardSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    categories: [ categorySchema ],
  },
)

export default mongoose.models?.Card || mongoose.model('Card', cardSchema)

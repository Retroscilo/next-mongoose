import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    prodName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    prodDescription: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    prodPrice: {
      type: String,
      required: true,
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
      maxLength: 20,
    },
    catDescription: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    products: [ productSchema ],
  },
)

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: String,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
    categories: [ categorySchema ],
  },
)

export default mongoose.models.Card || mongoose.model('Card', cardSchema)

/* eslint-disable no-invalid-this */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      verified: {
        type: Boolean,
        required: true,
      },
      code: {
        type: String,
        expiration: Date,
      },
    },
    restaurants: [ {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'restaurant',
    } ],
  },
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err)

    this.password = hash
    next()
  })
})

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return reject(err)
      resolve(same)
    })
  })
}

export default mongoose.models.User || mongoose.model('User', userSchema)

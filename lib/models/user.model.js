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
    created: {
      type: Date,
      default: Date.now(),
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
      expiration: {
        type: Date,
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

userSchema.path('email').validate(value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return reject(err)
      resolve(same)
    })
  })
}

userSchema.methods.checkVerificationCode = function (code) {
  const storedCode = this.status.code
  return code === storedCode
}

export default mongoose.models.User || mongoose.model('User', userSchema)

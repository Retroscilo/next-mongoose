import mongoose from 'mongoose'

const connect = (url = process.env.DBURL, opts = {}) => mongoose.connect(
  process.env.DBURL,
  { ...opts, useNewUrlParser: true, useUnifiedTopology: true },
)

export default connect

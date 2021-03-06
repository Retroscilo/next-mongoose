import mongoose from 'mongoose'

const connect = (url = process.env.DBURL, opts = {}) => mongoose.connect(
  url,
  { ...opts, useNewUrlParser: true, useUnifiedTopology: true },
)

export default connect

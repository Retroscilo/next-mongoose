import mongoose from 'mongoose'

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const connect = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) return handler(req, res)

  await mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true, useUnifiedTopology: true,
  })
    .catch(err => console.log(err))

  return handler(req, res)
}

export default connect

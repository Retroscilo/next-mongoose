import withSession from '../../lib/session'
import connect from '../../lib/connectDB'
import User from '../../lib/models/user.model'

export default withSession(async (req, res) => {
  const { email, password } = await req.body

  try {
    await connect()

    // regex here ?
    if (!email || !password) return res.status(400).send({ message: 'invalid email or password' })

    const user = await User.findOne({ email }).exec()

    const match = await user.checkPassword(password)
    if (!match) throw new Error('invalid email/password')

    const userInfo = { isLoggedIn: true, email, _id: user.id }
    req.session.set('user', userInfo)
    await req.session.save()
    res.json(user)
  } catch (error) {
    const { response: fetchResponse } = error
    res.status(fetchResponse?.status || 401).json({ message: error.message })
  }
})

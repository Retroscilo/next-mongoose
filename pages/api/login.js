import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'
import User from '../../lib/models/user.model'
import nc from 'next-connect'

const handler = nc()
  .post(withSession(async (req, res) => {
    const { email, password } = await req.body

    try {
      if (!email || !password) return res.status(400).send({ message: 'invalid email or password' })

      const user = await User.findOne({ email }).exec()

      const match = await user.checkPassword(password)
      if (!match) throw new Error('invalid email/password')

      req.session.set('user', { userId: user._id, email, isLoggedIn: true })
      await req.session.save()

      res.json(user)
    } catch (error) {
      const { response: fetchResponse } = error
      res.status(fetchResponse?.status || 401).json({ message: error.message })
    }
  }))

export default connect(handler)

import withSession from '../../lib/session'
import connect from '../../lib/connectDB'
import User from '../../lib/models/user.model'

export default withSession(async (req, res) => {
  const { email, password } = await req.body
  await connect()

  try {
    const newUser = User.create({ email, password })

    req.session.set('user', { email })
    await req.session.save()

    res.status(201).send(newUser)
  } catch (e) {
    console.log(e)
    return res.status(401).json({ error: e.message })
  }
})

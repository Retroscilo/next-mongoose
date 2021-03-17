import withSession from '../../lib/session'
import connect from '../../lib/connectDB'
import User from '../../lib/models/user.model'
import fetchJson from '../../lib/fetchJson'

export default withSession(async (req, res) => {
  const { email, password } = await req.body
  await connect()

  try {
    const newUser = await User.create({ email, password })
    console.log(newUser)
    req.session.set('user', { isLoggedIn: true, email, _id: newUser.id })
    await req.session.save()

    res.status(201).send(newUser)
  } catch (e) {
    console.log(e)
    return res.status(401).json({ error: e })
  }
})

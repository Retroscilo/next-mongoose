import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import User from '../../../lib/models/user.model'
import fetchJson from '../../../lib/fetchJson'

export default connect(withSession(async (req, res) => {
  const { email, password } = await req.body

  try {
    if (!email) throw new Error('Merci de saisir un E-mail.')
    if (!password) throw new Error('Merci de saisir un mot de passe.')
    if (password.length < 8) throw new Error('Le mot de passe doit faire au moins 8 charactères.')
    const user = await User.findOne({ email })
    if (user) throw new Error('Ce mail est déjà utilisé.')
    const newUser = await User.create({
      email,
      password,
      status: { verified: false },
    })
    req.session.set('user', { isLoggedIn: true, email, userId: newUser._id, verified: false })
    await req.session.save()

    res.status(201).send(newUser)
  } catch (e) {
    console.log(e)
    return res.status(401).json({ message: e.message })
  }
}))

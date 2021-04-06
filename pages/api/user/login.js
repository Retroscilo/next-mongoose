import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import User from '../../../lib/models/user.model'
import nc from 'next-connect'

const handler = nc()
  .post(withSession(async (req, res) => {
    const { email, password } = await req.body

    try {
      if (!email) return res.status(401).send({ message: "Vous n'avez pas renseigné votre adresse E-mail." })
      if (!password) return res.status(401).send({ message: "Vous n'avez pas renseigné de mot de passe." })

      const user = await User.findOne({ email }).exec()
      if (!user) throw new Error('E-mail ou mot de passe incorrect.')
      const match = await user.checkPassword(password)
      if (!match) throw new Error('E-mail ou mot de passe incorrect.')

      req.session.set('user', { userId: user._id, email, isLoggedIn: true, verified: user.status.verified })
      await req.session.save()

      res.json(user)
    } catch (error) {
      const { response: fetchResponse } = error
      res.status(fetchResponse?.status || 401).json({ message: error.message })
    }
  }))

export default connect(handler)

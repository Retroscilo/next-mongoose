import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import { generateCode, sendResetPassword } from '../../../lib/mailing'
import User from '../../../lib/models/user.model'

const handler = nc()
  // It's a put cause user may not be logged in (when he want to recover his password), and I need a mail to send the resetPassword mail
  .put(async (req, res) => {
    try {
      const email = req.body
      const user = await User.findOne({ email })
      console.log(email, user)
      if (!user) throw new Error("Ce mail n'existe pas")
      const code = generateCode()

      user.status = { ...user.status, code, Date: new Date() }
      const date = new Date()
      user.status.expiration = date.setUTCHours(date.getHours() + 1)
      await user.save()

      sendResetPassword(email, code)
      res.status(200).send(user)
    } catch (err) {
      console.log(err)
      return res.status(400).send({ body: err.message })
    }
  })
  .post(async (req, res) => {
    // Change user's pass
    try {
      const lock = generateCode()
      const session = req.session.get('user')
      const user = await User.findById(session.userId)

      const { code, pass } = req.body
      if (user.status.code !== code) throw new Error("Il y un problème avec vos codes d'accès, nous vous avons envoyé un nouveau mail.")
      user.password = pass
      // change status code to prevent multiple modification from one password mail
      user.status.code = lock
      await user.save()

      return res.status(200).send(user)
    } catch (err) {
      console.log(err)
      return res.status(401).send({ body: errors(err) })
    }
  })

export default withSession(connect(handler))

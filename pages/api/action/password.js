import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import { generateCode, sendResetPassword } from '../../../lib/mailing'
import User from '../../../lib/models/user.model'
import errors from '../../../lib/errors'

const handler = nc()
  // It's a PUT : user may not be logged in (when he want to recover his password), and I need a mail to send the resetPassword mail
  .put(async (req, res) => {
    try {
      const email = req.body
      if (!email) throw new Error('Merci de rentrer un email.')
      const user = await User.findOne({ email })
      if (!user.status.verified) throw new Error("Merci de faire vérifier votre email d'abord !")

      // Change user status with new code and expiration + 1 hour
      const code = generateCode()
      const date = new Date()
      user.status.code = code
      user.status.expiration = date.setUTCHours(date.getHours() + 1)
      await user.save()

      sendResetPassword(email, user.status._id, code)
      res.send({ message: 'mail envoyé' })
    } catch (err) {
      console.log(err)
      return res.status(400).send({ message: err.message })
    }
  })
  .post(async (req, res) => {
    // Change user's pass
    try {
      const { id: statusId, code, newPass } = req.body
      if (!newPass) throw new Error('Merci de saisir un nouveau mot de passe')
      const user = await User.findOne({ 'status._id': statusId })

      if (user.status.expiration < new Date()) throw new Error('Vos codes sont expirés, essayez de nouveau !')
      if (!user || !code || user.status.code !== code) throw new Error("Il y un problème avec vos codes d'accès, essayez à nouveau")

      user.password = newPass
      // change status code to prevent multiple modification from one mail
      const lock = generateCode()
      user.status.code = lock
      await user.save()

      return res.send(req.body)
    } catch (err) {
      console.log(err)
      return res.status(401).send({ message: err.message })
    }
  })

export default withSession(connect(handler))

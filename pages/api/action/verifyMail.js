import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import { generateCode, sendConfirmationMail } from '../../../lib/mailing'
import User from '../../../lib/models/user.model'

const handler = nc()
  .get(async (req, res) => {
    const session = req.session.get('user')
    const code = generateCode()

    try {
      const user = await User.findById(session.userId)
      user.status = { verified: false, code, Date: new Date() }
      const date = new Date()
      user.status.expiration = date.setUTCHours(date.getHours() + 1)
      await user.save()
      sendConfirmationMail(session.email, code)

      res.status(200).send(user)
    } catch (err) {
      console.log(err)
      throw err
    }
  })
  .post(async (req, res) => {
    try {
      const session = req.session.get('user')
      const user = await User.findById(session.userId)

      if (!user.checkVerificationCode(req.body)) throw new Error('Les codes de vérification ne correspondent pas !')
      if (user.status.verified) throw new Error('Vous avez déjà validé ce mail !')
      const date = new Date()
      if (user.status.expiration > date.setUTCHours(date.getHours() + 1)) {
        const code = generateCode()
        sendConfirmationMail(session.email, code)
        throw new Error('Votre code est expiré, nous venons de vous renvoyer un nouveau mail de confirmation.')
      }

      user.status.verified = true

      await user.save()

      res.status(200).send(user)
    } catch (err) {
      console.log(err)
      return res.status(400).send({ body: err.message })
    }
  })

export default withSession(connect(handler))

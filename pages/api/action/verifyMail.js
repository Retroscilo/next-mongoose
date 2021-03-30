import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import { generateCode, sendConfirmationMail } from '../../../lib/mailing'
import User from '../../../lib/models/user.model'

const handler = nc()
  .get(async (req, res) => {
    const session = req.session.get('user')
    const code = generateCode()
    console.log('test')
    try {
      const user = await User.findById(session.userId)
      console.log(user)
      user.status = { verified: false, code, Date: new Date() }
      await user.save()
      sendConfirmationMail(session.email, code)
    } catch (err) {
      console.log(err)
      throw err
    }
  })
  .post(async (req, res) => {
    try {
      const session = req.session.get('user')
      const user = await User.findById(session.userId)

      if (!user.checkVerificationCode(req.body) || user.status.verified) throw new Error('Les codes de vérification ne correspondent pas !')
      user.status.verified = true
      await user.save()

      res.status(200).send(user)
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  })

export default withSession(connect(handler))

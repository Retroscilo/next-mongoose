import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import { generateCode, sendConfirmationMail } from '../../../lib/mailing'
import User from '../../../lib/models/user.model'

const handler = nc()
  .get(async (req, res) => {
    const session = req.session.get('user')
    const code = generateCode()
    const user = await User.findById(session.userId)
    user.status.code = { code }
    sendConfirmationMail(session.email, code)
  })
  .post(async (req, res) => {
    console.log(req.body)
  })

export default withSession(connect(handler))

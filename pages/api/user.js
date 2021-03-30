/* eslint-disable curly */
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'
import nc from 'next-connect'
import User from '../../lib/models/user.model'
import fetchJson from '../../lib/fetchJson'

const handler = nc()
  .get(async (req, res) => {
    const session = req.session.get('user')
    const user = await User.findById(session.userId)
    console.log(user)

    if (session) {
      res.json({
        isLoggedIn: true,
        ...session,
        email: user.email,
        verified: user.status.verified,
      })
    } else {
      res.json({
        isLoggedIn: false,
      })
    }
  })
  .patch(async (req, res) => {
    // Change user's mail
    const session = req.session.get('user')
    try {
      const newMail = req.body

      // Check if mail is already used and return error
      const exist = await User.findOne({ email: newMail })
      if (exist) throw new Error('Cet email est déjà utilisé !')

      const user = await User.findById(session.userId)
      user.email = newMail
      await user.save()
    } catch (err) {
      console.log(err.message)
      return res.status(400).send({ body: err.message })
    }
  })

export default connect(withSession(handler))

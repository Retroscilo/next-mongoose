/* eslint-disable curly */
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import nc from 'next-connect'
import User from '../../../lib/models/user.model'
import Restaurant from '../../../lib/models/restaurant.model'
import Card from '../../../lib/models/card.model'
import errors from '../../../lib/errors'

const handler = nc()
  .get(async (req, res) => {
    const session = req.session.get('user')

    if (session) {
      const user = await User.findById(session.userId)
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

      // Set new mail in Database
      const user = await User.findById(session.userId)
      user.email = newMail
      await user.save()

      // Set immediatly new session mail
      req.session.set('user', { ...session, email: newMail })
      await req.session.save()

      res.status(200).send(user)
    } catch (err) {
      console.log(errors(err))
      return res.status(400).send({ body: errors(err) })
    }
  })
  .delete(async (req, res) => {
    try {
      const session = req.session.get('user')
      const user = await User.findById(session.userId)

      // Delete cards
      const restaurants = await Restaurant.find({ owner: user._id })
      const cardsId = restaurants.map(restaurant => restaurant.cards).flat()
        .map(card => card.cardId)
      await Card.deleteMany({ _id: { $in: cardsId } })

      // Delete restaurants
      await Restaurant.deleteMany({ owner: user._id })

      // Delete User
      await User.findByIdAndDelete(user._id)

      res.status(200).send(user)
    } catch (err) {
      console.log(err)
      return res.status(401).send({ body: errors(err) })
    }
  })

export default connect(withSession(handler))

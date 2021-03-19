import nc from 'next-connect'
import withSession from '../../lib/session'
import connect from '../../lib/connectDB'
import User from '../../lib/models/user.model'

const handler = nc()
  .post(withSession(async (req, res) => {
    await connect()
    try {
      const userId = req.session.get('user')._id
      const restaurantName = req.body.restaurantName
      const user = await User.findById(userId)

      if (user.restaurants.length > 0) return res.status(401).json({ err: 'Vous avez déjà un restaurant' })

      user.restaurants.push({
        restaurantName,
      })

      const session = req.session.get('user')
      req.session.set('user', { ...session, restaurants: user.restaurants })
      await req.session.save()
      await user.save()

      res.status(200).json(user)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ error: err })
    }
  }))

export default handler

import nc from 'next-connect'
import withSession from '../../lib/session'
import connect from '../../lib/connectDB'
import User from '../../lib/models/user.model'

const handler = nc()
  .post(withSession(async (req, res) => {
    await connect()
    try {
      const userId = req.session.get('user')._id
      console.log(userId)
      const restaurantName = req.body.restaurantName
      const user = await User.findById(userId)

      user.restaurants.push({
        restaurantName,
      })
      await user.save()
      res.status(200).json(user)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ error: err })
    }
  }))

export default handler

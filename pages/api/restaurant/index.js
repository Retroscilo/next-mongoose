import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import User from '../../../lib/models/user.model'
import Restaurant from '../../../lib/models/restaurant.model'
import Card from '../../../lib/models/card.model'

const handler = nc({ attachParams: true })
  .get(withSession(async (req, res) => {
    // All user's restaurants
    const session = req.session.get('user')
    try {
      const user = await User.findById(session.userId)
      const restaurants = await Restaurant.find({ _id: { $in: user.restaurants } })

      return res.status(200).json(restaurants)
    } catch (err) {
      console.log(err)
      return res.status(404).send('restaurants not found')
    }
  }))
  .post(withSession(async (req, res) => {
    const userId = req.session.get('user').userId
    try {
      const restaurantName = req.body.restaurantName
      const user = await User.findById(userId)
      const newRestaurant = await Restaurant.create({ restaurantName: restaurantName || 'Nouveau restaurant', owner: user._id })

      // Prescience... this will be the line your looking for resolving restaurant problem o.o
      /* if (user.restaurants.length > 0) return res.status(401).json({ err: 'Vous avez déjà un restaurant' }) */

      user.restaurants.push(newRestaurant._id)
      await user.save()
      await newRestaurant.save()

      res.status(200).json(user)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ error: err })
    }
  }))

export default connect(handler)

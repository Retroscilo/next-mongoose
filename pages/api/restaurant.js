import nc from 'next-connect'
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'
import User from '../../lib/models/user.model'
import Restaurant from '../../lib/models/restaurant.model'
import Card from '../../lib/models/card.model'

const handler = nc()
  .get(withSession(async (req, res) => {
    const userId = req.session.get('user').userId
    try {
      const user = await User.findById(userId)
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
      const newRestaurant = await Restaurant.create({ restaurantName, owner: user._id })

      // Prescience... this will be the line your looking for resolving restaurant problem o.o
      if (user.restaurants.length > 0) return res.status(401).json({ err: 'Vous avez déjà un restaurant' })

      user.restaurants.push(newRestaurant._id)
      await user.save()
      await newRestaurant.save()

      res.status(200).json(user)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ error: err })
    }
  }))
  .put(withSession(async (req, res) => {
    const userId = req.session.get('user').userId
    try {
      const restaurant = await Restaurant.findById(req.body.restaurantId)

      // Verify if restaurantId is a part of the actual user's restaurant
      const user = await User.findById(userId)
      const userRestaurants = await Restaurant.find({ _id: { $in: user.restaurants } })
      if (userRestaurants.map(restaurant => restaurant._id.toString()).indexOf(req.body.restaurantId) === -1) return res.status(401).send({ err: "Vous essayez d'accéder à un restaurant qui ne vous appartient pas !" })

      const card = await Card.create(
        {
          restaurant: restaurant._id,
          categories:
          [
            {
              catName: 'Nom de la catégorie',
              catDescription: 'description de la catégorie',
              products: [
                {
                  prodName: 'Nom du produit',
                  prodDescription: 'description du produit',
                  prodPrice: '5',
                },
              ],
            },
          ],
        },
      )
      restaurant.cards.push({ cardId: card._id, name: req.body.name })
      if (!restaurant.activeCard) restaurant.activeCard = card._id
      await restaurant.save()
      await card.save()

      res.status(200).json(userRestaurants)
    } catch (err) {
      console.log(err)
      res.status(401).send(err)
    }
  }))

export default connect(handler)

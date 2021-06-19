import nc from 'next-connect'
import withSession from '../../../lib/session'
import connect from '../../../lib/middlewares/mongodb'
import User from '../../../lib/models/user.model'
import Restaurant from '../../../lib/models/restaurant.model'
import Card from '../../../lib/models/card.model'
import requestSession from '../../../lib/middlewares/requestSession'

const handler = nc({ attachParams: true })
  .use(requestSession)
  .get(async (req, res) => {
    // Get restaurant informations & cards (SWR used in /cards)
    try {
      const restaurantId = req.query.restaurantId
      // l'utilisateur n'a pas de restaurant
      if (restaurantId === 'undefined') return res.status(404).json({ err: 'Aucun restaurant défini' })
      const restaurant = await Restaurant.findById(restaurantId)
      return res.status(200).json(restaurant)
    } catch (err) {
      console.log(err)
      return res.status(404).send('restaurants not found')
    }
  })
  .post(async (req, res) => {
    // Create new card
    try {
      const restaurantId = req.query.restaurantId
      const card = await Card.create({ restaurantId })
      card.categories.push({
        catName: 'Viandes, poissons...',
        catDescription: 'Description de la catégorie',
        products: [ {
          prodName: 'Mon premier produit',
          prodDescription: 'description du produit',
          prodPrice: '3',
          labels: [ 'homemade' ],
        } ],
      })

      card.catOrder = card.categories.map(cat => cat._id)
      card.categories[0].prodOrder = card.categories[0].products.map(prod => prod._id)

      const restaurant = await Restaurant.findById(restaurantId)
      const date = new Date()

      if (restaurant.cards.length === 0) restaurant.activeCard = card._id
      restaurant.cards.push({ cardId: card._id, name: 'Menu ' + date.getMonth() + ' ' + date.getFullYear() })

      await card.save()
      await restaurant.save()

      return res.json(req.query)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  })
  .patch(async (req, res) => {
    // Change restaurant informations
    try {
      const restaurantId = req.query.restaurantId
      const { field, newValue } = req.body
      const restaurant = await Restaurant.findById(restaurantId)
      restaurant[field] = newValue
      await restaurant.save()

      res.status(200).send(restaurant)
    } catch (err) {
      console.log(err)
      res.status(400).send({ err })
    }
  })
  .put(async (req, res) => {
    // Change active card
    try {
      const { restaurantId } = req.query
      const cardId = req.body

      const restaurant = await Restaurant.findById(restaurantId)

      restaurant.activeCard = cardId
      await restaurant.save()

      return res.status(200).json(restaurant)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  })
  .delete(async (req, res) => {
    // Delete restaurant (account)
    try {
      const { restaurantId } = req.query
      const { userId } = req.session.get('user')

      // clean restaurant in user's list
      const user = await User.findById(userId)
      const restaurantIndex = user.restaurants.indexOf(restaurantId)
      if (restaurantIndex === -1) return res.status(404).send('Il y a eu un problème lors de la suppression du restaurant')
      user.restaurants.splice(restaurantIndex, 1)
      await user.save()

      // Clean all cards relative to restaurant
      await Card.deleteMany({ restaurantId })

      // clean restaurant
      await Restaurant.findByIdAndDelete(restaurantId)

      return res.status(200).json(req.query)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  })

export default withSession(connect(handler))

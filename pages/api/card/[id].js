import nc from 'next-connect'
import connect from '../../../lib/middlewares/mongodb'
import Restaurant from '../../../lib/models/restaurant.model'
import Card from '../../../lib/models/card.model'
import requestSession from '../../../lib/middlewares/requestSession'

const handler = nc()
  .use(requestSession)
  .post(async (req, res) => {
    // Create new card
    try {
      const { id: restaurantId } = req.query
      const card = await Card.create({ restaurantId })
      const restaurant = await Restaurant.findById(restaurantId)
      const date = new Date()
      restaurant.cards.push({ cardId: card._id, name: 'Menu ' + date.getFullYear() })

      await card.save()
      await restaurant.save()

      return res.json(req.query)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  })
  .patch(async (req, res) => {
    // Change card name
    try {
      const { id: restaurantId } = req.query
      const { cardId, newName } = req.body
      const updatedCard = { cardId, name: newName }

      const restaurant = await Restaurant.findById(restaurantId)

      const cardIndex = restaurant.cards.findIndex(card => card.cardId.toString() === cardId)
      if (cardIndex === -1) return res.status(404).send('Il semble y avoir un problème avec vos cartes')
      restaurant.cards[cardIndex] = updatedCard

      await restaurant.save()

      return res.send(req.query)
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  })
  .delete(async (req, res) => {
    // Delete card
    try {
      const { id: restaurantId } = req.query
      const cardId = req.body

      const restaurant = await Restaurant.findById(restaurantId)
      const cardIndex = restaurant.cards.findIndex(card => card.cardId.toString() === cardId)
      if (cardIndex === -1) return res.status(404).send('Il y a eu un problème avec votre carte !')
      restaurant.cards.splice(cardIndex, 1)

      await restaurant.save()

      await Card.findByIdAndDelete(cardId)

      return res.send(req.query)
    } catch (err) {
      console.log(err)
      return res.status(400).send(err)
    }
  })

export default connect(handler)

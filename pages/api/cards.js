import Card from '../../lib/models/card.model'
import Restaurant from '../../lib/models/restaurant.model'
import User from '../../lib/models/user.model'
import nc from 'next-connect'
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'

const handler = nc()
  .post(withSession(async (req, res) => {
    try {
      const session = req.session.get('user')
      const user = await User.findById(session.userId)

      const { restaurantId, name } = req.body

      const card = await Card.create(
        {
          restaurant: restaurantId,
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

      const restaurant = await Restaurant.findById(restaurantId)

      restaurant.cards.push({ cardId: card._id, name })
      await restaurant.save()
      await card.save()

      res.status(200).json(card)
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e.message })
    }
  }))
  .get(withSession(async (req, res) => {
    const user = req.session.get('user')

    try {
      const cards = await Card
        .find({ createdBy: user._id })
        .lean()
        .exec()
      if (!cards) return res.status(200).end()
      return res.status(200).json(cards)
    } catch (e) {
      console.log(e)
      res.status(404).json({ error: e.message })
    }
  }))
  .delete(async (req, res) => {
    try {
      const deleted = await Card.findOneAndRemove({ _id: req.body.id })
      res.status(200).json(deleted)
    } catch (err) {
      console.log(err)
      res.status(401).json({ error: err.message })
    }
  })

export default connect(handler)

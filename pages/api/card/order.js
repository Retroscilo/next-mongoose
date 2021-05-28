import Card from '../../../lib/models/card.model'
import nc from 'next-connect'
import connect from '../../../lib/middlewares/mongodb'
import requestSession from '../../../lib/middlewares/requestSession'

const handler = nc()
  .use(requestSession)
  .post(async (req, res) => { // change products order
    try {
      const { cardId, catId, newOrder } = req.body
      const card = await Card.findById(cardId).exec()
      const category = card.categories.id(catId)
      category.prodOrder = newOrder
      await card.save()
      res.status(200).json(newOrder)
    } catch (e) {
      res.status(400).json({ error: e.message })
    }
  })

export default connect(handler)

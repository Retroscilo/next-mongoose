import nc from 'next-connect'
import connect from '../../../lib/middlewares/mongodb'
import Restaurant from '../../../lib/models/restaurant.model'

const handler = nc()
  .get(async (req, res) => {
    try {
      const restaurants = await Restaurant.find()
        .lean()
        .exec()
      const restaurantsActiveCard = restaurants.map(r => r.activeCard)
      res.status(200).json(restaurantsActiveCard)
    } catch (e) {
      res.status(404).send('Il y eu un problème, nous sommes désolé pour la gêne occasionnée.')
    }
  })

export default connect(handler)

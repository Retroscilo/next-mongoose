import nc from 'next-connect'
import Restaurant from '../../../lib/models/restaurant.model'
import requestSession from '../../../lib/middlewares/requestSession'

const handler = nc()
  .use(requestSession)
  .post(async (req, res) => {
    try {
      const { id, field, value } = req.body
      const restaurant = await Restaurant.findById(id)
      restaurant.QR[field] = value
      await restaurant.save()

      return res.status(200).send(req.body)
    } catch (err) {
      console.log(err)
    }
  })

export default handler

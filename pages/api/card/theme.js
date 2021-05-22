import Card from '../../../lib/models/card.model'
import nc from 'next-connect'
import connect from '../../../lib/middlewares/mongodb'
import requestSession from '../../../lib/middlewares/requestSession'

const handler = nc()
  .use(requestSession)
  .post(async (req, res) => { // change background
    try {
      const { cardId, background } = req.body
      const card = await Card.findById(cardId).exec()
      card.theme.background = background

      await card.save()

      res.status(200).send({ background })
    } catch (e) {
      console.log(e)
      res.status(401).json({ error: e.message })
    }
  })

export default connect(handler)

import Card from '../../../lib/models/card.model'
import nc from 'next-connect'
import requestSession from '../../../lib/middlewares/requestSession'
import connect from '../../../lib/middlewares/mongodb'
import errors from '../../../lib/errors'

const handler = nc()
  .use(requestSession)
  .get(async (req, res) => {
    try {
      const id = req.query.id
      const card = await Card.findOne({ _id: id })
      const categories = card.categories
      res.status(200).json(categories)
    } catch (e) {
      console.log(e)
      res.status(404).json({ error: e.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { id: cardId } = req.body
      const card = await Card.findById(cardId)

      card.categories.push({
        catName: 'Nouvelle catégorie',
        catDescription: 'Une description ?',
        products: [ { prodName: 'Mon produit', prodDescription: 'Une description ?', prodPrice: '3' } ],
      })
      const newCategory = await card.save()

      res.status(200).json(newCategory)
    } catch (e) {
      console.log(e)
      res.status(401).send({ body: e.message })
    }
  })
  .put(async (req, res) => {
    try {
      const { field, value: newValue, catId, cardId } = req.body
      const card = await Card.findById(cardId).exec()
      const category = card.categories.id(catId)

      category[field] = newValue
      const updatedCategory = await card.save()

      res.status(200).json(updatedCategory)
    } catch (e) {
      res.status(400).json({ body: errors(e) })
    }
  })
  .delete(async (req, res) => {
    try {
      const { cardId, catId } = req.body
      const card = await Card.findById(cardId)
      const deletedCategory = card.categories.id(catId).remove()

      await card.save()

      res.status(200).json(deletedCategory)
    } catch (e) {
      console.log(e)
      return res.status(401).json({ error: e.message })
    }
  })

export default connect(handler)

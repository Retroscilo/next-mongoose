import Card from '../../../lib/models/card.model'
import nc from 'next-connect'
import requestSession from '../../../lib/middlewares/requestSession'
import connect from '../../../lib/middlewares/mongodb'
import errors from '../../../lib/errors'

const handler = nc()
  .use(requestSession)
  .post(async (req, res) => {
    try {
      const { id: cardId } = req.body
      const card = await Card.findById(cardId)
      card.categories.push({
        catName: 'Nouvelle catégorie',
        catDescription: 'Une description ?',
        products: [ { prodName: 'Mon produit', prodDescription: 'Une description ?', prodPrice: '3' } ],
      })

      const newCatId = card.categories[card.categories.length - 1]._id
      const newCat = card.categories.find(cat => cat._id === newCatId)
      const newProdId = newCat.products[0]._id
      card.catOrder.push(newCatId)
      newCat.prodOrder.push(newProdId)

      await card.save()
      res.status(200).json(newCatId)
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

      const newCatOrder = card.catOrder.filter(id => id != catId)
      card.catOrder = newCatOrder
      await card.save()

      res.status(200).json(deletedCategory)
    } catch (e) {
      console.log(e)
      return res.status(401).json({ error: e.message })
    }
  })

export default connect(handler)

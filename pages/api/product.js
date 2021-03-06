import Card from '../../lib/models/card.model'
import nc from 'next-connect'
import connect from '../../lib/connectDB'

const handler = nc()
  .post(async (req, res) => {
    await connect()
    try {
      const { cardId, catId } = req.body
      const card = await Card.findById(cardId).exec()
      const category = card.categories.id(catId)

      category.products.push({ prodName: 'Mon produit', prodDescription: 'Une description ?', prodPrice: '3' })
      const newProduct = await card.save()

      res.status(200).json(newProduct)
    } catch (e) {
      console.log(e)
      res.status(401).json({ error: e.message })
    }
  })
  .put(async (req, res) => {
    await connect()
    try {
      const { cardId, catId, prodId, field, value: newValue } = req.body
      const card = await Card.findById(cardId).exec()
      const category = card.categories.id(catId)
      const product = category.products.id(prodId)

      product[field] = newValue
      const updatedProduct = await card.save()

      res.status(200).json(updatedProduct)
    } catch (e) {
      console.log(e)
      res.status(401).json({ error: e.message })
    }
  })
  .delete(async (req, res) => {
    await connect()
    try {
      const { cardId, catId, prodId } = req.body
      const card = await Card.findById(cardId)
      const category = card.categories.id(catId)
      const deletedProduct = category.products.id(prodId).remove()

      await card.save()

      res.status(200).json(deletedProduct)
    } catch (e) {
      console.log(e)
      return res.status(401).json({ error: e.message })
    }
  })

export default handler

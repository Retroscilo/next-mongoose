import withSession from '../session'
import Card from '../models/card.model'
import User from '../models/user.model'

// Ensure a session exist to use this api.
// I don't think I have to check if the requested card belong to the connected user since i do this verification in getServerSideProps in cards/[id]
const secureCards = async (req, res, next) => {
  const session = req.session.get('user')
  if (!session) return res.status(401).send({ message: 'no user connected' })
  /* const user = await User.findById(session.userId)
  const card = await Card.findById(req.query.id)
  if (!card || user.restaurants.indexOf(card.restaurantId) === -1) return res.status(401).send({ message: "this card doesn't belong to this user" }) */
  next()
}

export default withSession(secureCards)

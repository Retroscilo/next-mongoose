/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Front
import { jsx } from 'theme-ui'

// Components
import Menu from '../../components/card/Menu'
import propTypes from 'prop-types'

// SG
import Card from '../../lib/models/card.model'
import Restaurant from '../../lib/models/restaurant.model'

const CardViewer = ({ card, restaurant }) => (
  <Menu
    card={card}
    restaurant={restaurant}
    client
  />)

export async function getStaticPaths () {
  return {
    // path that need to be generated at build time
    paths: [ { params: { id: '60732245a07d30307fcdcb9c' } } ],
    // https://nextjs.org/docs/basic-features/data-fetching#fetching-data-on-the-client-side
    fallback: true,
  }
}

export async function getStaticProps ({ params }) {
  const card = await Card.findById(params.id).lean()
  const restaurant = await Restaurant.findById(card.restaurantId).lean()

  return {
    props: { card: JSON.parse(JSON.stringify(card)), restaurant: JSON.parse(JSON.stringify(restaurant)) },
    revalidate: 1,
  }
}

export default CardViewer

CardViewer.propTypes = {
  card: propTypes.object,
  restaurant: propTypes.object,
}

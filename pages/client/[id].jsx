/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Front
import { jsx, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'

// Components
import Menu from '../../components/card/Menu'
import propTypes from 'prop-types'
import { CardProvider, useCard } from '../../lib/hooks/useCard'

// SG
import Card from '../../lib/models/card.model'
import Restaurant from '../../lib/models/restaurant.model'
import connect from '../../lib/connectDB'

const CardViewer = ({ card, restaurant }) => {
  const router = useRouter()
  if (router.isFallback) return (
    <Spinner />
  )
  return (
    <CardProvider card={card}>
      <Menu restaurant={restaurant} client />
    </CardProvider>
  )
}

export async function getStaticPaths () {
  await connect()
  const res = await Restaurant.find()

  const restaurantsActiveCard = res
    .filter(restaurant => restaurant.activeCard !== undefined)
    .map(restaurant => {
      return { params: { id: String(restaurant.activeCard) } }
    })

  return {
    // path that need to be generated at build time
    paths: restaurantsActiveCard,
    // https://nextjs.org/docs/basic-features/data-fetching#fetching-data-on-the-client-side
    fallback: true,
  }
}

export const getStaticProps = async ({ params }) => {
  await connect()

  const card = await Card.findById(params.id).lean()
  console.log(card)
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

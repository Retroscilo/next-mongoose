/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Front
import { jsx } from 'theme-ui'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
import Menu from '../../components/card/Menu'
import propTypes from 'prop-types'
// Hooks
import useSwr from 'swr'
import useUser from '../../lib/hooks/useUser'
// SSR
import User from '../../lib/models/user.model'
import Restaurant from '../../lib/models/restaurant.model'
import Card from '../../lib/models/card.model'
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'

const CardEditor = ({ SSRcard, restaurant }) => {
  // Check if User connected, nor redirect
  useUser({ redirectTo: '/login', redirectIfFound: false })

  // CSR
  const router = useRouter()
  const { id } = router.query
  const { data: card, mutate: updateCard } = useSwr('/api/card/' + id, fetchJson, { initialData: SSRcard })

  const addCategory = async () => {
    const body = { id }
    await fetchJson('/api/card/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await updateCard()
  }

  return (
    <Menu
      card={card}
      restaurant={restaurant}
      client={false}
      updateCard={updateCard}
      addCategory={addCategory}
    />
  )
}

export const getServerSideProps = connect(withSession(async ({ req, res, params }) => {
  const session = req.session.get('user')
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  const user = await User.findById(session.userId)
  const card = await Card.findById(params.id)
  const restaurant = await Restaurant.findById(card.restaurantId)

  // if card not found or is not in user's restaurants, redirect.
  if (!card || user.restaurants.indexOf(card.restaurantId) === -1) return { redirect: { destination: '/cards', permanent: false } }
  return {
    props: {
      SSRcard: JSON.parse(JSON.stringify(card)),
      restaurant: JSON.parse(JSON.stringify(restaurant)),
    },
  }
}))

export default CardEditor

CardEditor.propTypes = {
  SSRcard: propTypes.object,
  restaurant: propTypes.object,
}

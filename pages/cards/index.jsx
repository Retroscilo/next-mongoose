/** @jsxRuntime classic */
/** @jsx jsx */
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'
import { jsx, Button } from 'theme-ui'
import useUser from '../../lib/hooks/useUser'
import useSWR from 'swr'
import User from '../../lib/models/user.model'
import Restaurant from '../../lib/models/restaurant.model'
import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import fetchJSON from '../../lib/fetchJson'

/** Futur implements:
 * -> micro-animation when a card is set as activeCard
 * -> micro-animation when adding a card
 */

const Cards = ({ restaurants }) => {
  useUser({ redirectTo: '/login', redirectIfFound: false })

  // use first restaurant in list (data already here with ssr)
  const [ restaurant, setRestaurant ] = useState(restaurants[0])

  // then subscribe to given restaurant data (e.g. first in list on request)
  const { data: freshRestaurant, mutate } = useSWR(`/api/restaurant/${ restaurant._id }`, fetchJSON)

  // update stale data with SWR
  useEffect(() => freshRestaurant && setRestaurant(freshRestaurant), [ freshRestaurant ])

  const addCart = async () => {
    // pre-populate data
    const date = new Date()
    setRestaurant({ ...restaurant, cards: [ ...restaurant.cards, { cardId: 'prefetched', name: 'Menu ' + date.getFullYear() } ] })

    // then do a post request
    await fetchJSON(`/api/restaurant/${ restaurant._id }`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    // finally re-validate cached data
    mutate()
  }

  const setActive = async cardId => {
    setRestaurant({ ...restaurant, activeCard: cardId })
    await fetchJSON(`/api/restaurant/${ restaurant._id }`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(cardId),
    })
    mutate()
  }

  const updateCardName = async (cardId, newName) => {
    await fetchJSON(`/api/restaurant/${ restaurant._id }`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ cardId, newName }),
    })
    mutate()
  }

  const deleteCard = async cardId => {
    const cardIndex = restaurant.cards.findIndex(card => card.cardId === cardId)

    restaurant.cards.splice(cardIndex, 1)
    setRestaurant({ ...restaurant })

    await fetchJSON(`/api/restaurant/${ restaurant._id }`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(cardId),
    })
    mutate()
  }

  return (
    <>
      <ul sx={{ display: 'flex', width: '100%', bg: 'white', my: 0, height: '50px', alignItems: 'center' }}>
        {restaurants && restaurants.map(restaurant => (
          <li
            key={restaurant._id}
            onClick={() => setRestaurant(restaurant)}
          >
            {restaurant.restaurantName}
          </li>))}
      </ul>
      <div sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', maxWidth: '800px', mx: 'auto', my: 3, gridGap: 2, justifyItems: 'center', alignItems: 'center' }}>
        {!restaurants && <h1>Loading</h1>}
        {restaurants && restaurant.cards.map(card => (
          <Card
            key={card.cardId}
            id={card.cardId}
            name={card.name}
            setActive={setActive}
            updateName={updateCardName}
            deleteCard={deleteCard}
            active={card.cardId === restaurant.activeCard}
          />
        ))}
        <div
          onClick={addCart}
          sx={{ variant: 'Card.empty' }}
        >
          <div sx={{ variant: 'Add.product.desktop', position: 'initial', '&:hover': { boxShadow: 'low' } }} />
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = connect(withSession(async ({ req, res }) => {
  const session = req.session.get('user')
  const user = await User.findById(session.userId)
  const restaurants = await Restaurant.find({ _id: { $in: user.restaurants } })

  return {
    props: { restaurants: JSON.parse(JSON.stringify(restaurants)) },
  }
}))

export default Cards

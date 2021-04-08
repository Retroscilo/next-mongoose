/** @jsxRuntime classic */
/** @jsx jsx */
// Components & front
import { jsx } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Card from '../../components/card/Card'
import Link from 'next/link'
// Static Gen
import fetchJSON from '../../lib/fetchJson'
import useUser from '../../lib/hooks/useUser'
import useSWR from 'swr'
// SSR
import User from '../../lib/models/user.model'
import Restaurant from '../../lib/models/restaurant.model'
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'

/** Futur implements:
 * -> micro-animation when a card is set as activeCard
 * -> micro-animation when adding a card
 */

const Cards = ({ restaurants }) => {
  useUser({ redirectTo: '/login', redirectIfFound: false })

  // use first restaurant in list (data already here with ssr)
  const [ restaurant, setRestaurant ] = useState(restaurants[0] || false)

  // then subscribe to given restaurant data (e.g. first in list on request)
  const { data: freshRestaurant, mutate } = useSWR(`/api/restaurant/${ restaurant._id }`, fetchJSON)

  // update stale data with SWR
  useEffect(() => freshRestaurant && setRestaurant(freshRestaurant), [ freshRestaurant ])

  const addCart = async () => {
    // do a post request
    await fetchJSON(`/api/card/${ restaurant._id }`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    // re-validate cached data
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
    await fetchJSON(`/api/card/${ restaurant._id }`, {
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

    await fetchJSON(`/api/card/${ restaurant._id }`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(cardId),
    })
    mutate()
  }

  return (
    <>
      {restaurant &&
      <div sx={{ width: '100%', bg: 'white' }}>
        <ul sx={{ display: 'flex', maxWidth: 'body', mx: 'auto', my: 0, height: '50px', alignItems: 'center', justifyContent: 'space-evenly' }}>
          {restaurants.map(restaurantItem => (
            <li
              key={restaurantItem._id}
              onClick={() => setRestaurant(restaurantItem)}
              sx={{ cursor: 'pointer', border: restaurantItem._id === restaurant._id ? '2px solid' : '', borderColor: 'primary', borderRadius: '50px', px: 2 }}
            >
              {restaurantItem.restaurantName}
            </li>))}
          <li sx={{ variant: 'Button.primaryAlternate.S' }}>
            <Link href="/account"><a>Ajouter un restaurant</a></Link>
          </li>
        </ul>
      </div>
      }
      <div sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', flexDirection: [ 'column', 'row' ], width: 'fit-content', maxWidth: '800px', mx: 'auto', my: 5, '& > *': { ml: [ 0, 3 ], mb: 3 } }}>
        {!restaurant && <div>Oups, vous n'avez pas de restaurants enregistré ! Rendez-vous <Link href="/account"><a sx={{ color: 'primary' }}>ici</a></Link> pour créer un restaurant</div>}
        {restaurant && restaurant.cards.map(card => (
          <Card
            key={card.cardId}
            card={card}
            setActive={setActive}
            updateName={updateCardName}
            deleteCard={deleteCard}
            active={card.cardId === restaurant.activeCard}
          />
        ))}
        {restaurant &&
        <div
          onClick={addCart}
          sx={{ variant: 'Card.empty', '&::before': { content: '""', background: 'url(/addYourFirstCard.svg) no-repeat', position: 'absolute', width: restaurant.cards.length === 0 ? '260px' : '0', height: '260px', backgroundSize: 'contain', left: '-270px', top: '10px' } }}
        >
          <span sx={{ color: 'primary' }}>Ajouter une carte</span> 
          <div sx={{ variant: 'Add.product.desktop', position: 'initial', border: 'none' }} />
        </div>}
      </div>
    </>
  )
}

export const getServerSideProps = connect(withSession(async ({ req, res }) => {
  const session = req.session.get('user')
  if (!session) return { props: { restaurants: [] } }
  const user = await User.findById(session.userId)
  const restaurants = await Restaurant.find({ _id: { $in: user.restaurants } })

  return {
    props: { restaurants: JSON.parse(JSON.stringify(restaurants)) },
  }
}))

export default Cards

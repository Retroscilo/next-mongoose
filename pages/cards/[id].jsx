/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Front
import { jsx } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
import Link from 'next/link'
// Components
import Category from '../../components/card/Category'
import propTypes from 'prop-types'
import { Switch, PrevArrow } from '../../components/misc/index'
// Hooks
import { useViewport } from '../../lib/hooks/useViewport'
import useUser from '../../lib/hooks/useUser'
// SSR
import User from '../../lib/models/user.model'
import Restaurant from '../../lib/models/restaurant.model'
import Card from '../../lib/models/card.model'
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'
import useSwr from 'swr'

/**
 * Render the view of menu
 * @param {object} card structure of menu (categories & product)
 * @param {object} restaurant contain restaurant info (name/description/photo...)
 * @param {bool} client set true for restaurant's client render or false to activate the editor
 * @returns {void}
*/
export const Menu = ({ card, restaurant, client, ...props }) => {
  const { width } = useViewport()
  const mobile = width < 832
  const [ clientView, setClientView ] = useState(client)

  return (
    <div sx={{ width: '100%', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div sx={{ width: '100%', bg: 'white' }}>
        <div sx={{ maxWidth: 'body', pl: mobile ? 2 : 3, m: '0 auto' }}>
          <div sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span sx={{ display: 'flex', alignItems: 'center' }}>
              {!client && <PrevArrow />}
              <h1>{restaurant.restaurantName}</h1>
            </span>
            {!client &&
              <Switch
                isOn={clientView}
                label={'Vue client'}
                onClick={() => setClientView(!clientView)}
              />}
          </div>
          <p>{restaurant.restaurantDescription}</p>
        </div>
      </div>
      <div sx={{ bg: 'white', position: 'sticky', top: '70px', width: '100%', zIndex: 60 }}>
        <ul sx={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: 'body', mx: 'auto', px: 3 }}>
          {card.categories.map(category => (
            <li key={category._id}><a href={`#${ category._id }`}>{category.catName}</a></li>
          ))}
        </ul>
      </div>
      {card.categories.map(category => (
        <Category
          client={clientView}
          key={category._id}
          cardId={card._id}
          structure={category}
          refresh={props.updateCard}
        />
      ))}
      {!clientView && <div sx={{ variant: 'Add.category' }} onClick={props.addCategory}>Ajouter une catégorie </div>}
    </div>
  )
}

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

Menu.propTypes = {
  addCategory: propTypes.func,
  card: propTypes.object,
  client: propTypes.bool,
  restaurant: propTypes.object,
  updateCard: propTypes.func,
}

CardEditor.propTypes = {
  SSRcard: propTypes.object,
  restaurant: propTypes.object,
}

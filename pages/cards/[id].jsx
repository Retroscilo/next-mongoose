/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

import { jsx, Spinner } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
// Components
import Category from '../../components/card/Category'
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

const CardHeader = ({ restaurant }) => {
  const { width } = useViewport()
  const mobile = width < 832

  return (
    <div sx={{ width: '100%', bg: 'white' }}>
      <div sx={{ maxWidth: 'body', pl: mobile ? 2 : 3, m: '0 auto' }}>
        <h1>{restaurant.restaurantName}</h1>
        <p>{restaurant.restaurantDescription}</p>
      </div>
    </div>
  )
}

const CardPage = ({ SSRcard, restaurant }) => {
  useUser({ redirectTo: '/login', redirectIfFound: false })
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
    <div sx={{ width: '100%', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {card.categories
        && <>
          <CardHeader restaurant={restaurant} />
          <div sx={{ bg: 'white', position: 'sticky', top: '70px', width: '100%', zIndex: 60 }}>
            <ul sx={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: 'body', mx: 'auto', px: 3 }}>
              {card.categories.map(category => (
                <li key={category._id}><a href={`#${ category._id }`}>{category.catName}</a></li>
              ))}
            </ul>
          </div>
          {card.categories.map((category, i) => (
            <Category
              key={i}
              cardId={card._id}
              structure={category} // category structure with title, desc. etc...
              refresh={updateCard} // method to call after each update in db (post/put)
            />
          ))}
          <div sx={{ variant: 'Add.category' }} onClick={addCategory}>Ajouter une catégorie</div>
        </>
      }
    </div>
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

export default CardPage

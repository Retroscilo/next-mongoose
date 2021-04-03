/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

import { jsx, Spinner } from 'theme-ui'
import React, { useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
// Components
import CardHeader from '../../components/RestaurantHeader'
import Category from '../../components/card/Category'
// Hooks
import useUser from '../../lib/hooks/useUser'
import useCard from '../../lib/hooks/useCard'
// SSR
import User from '../../lib/models/user.model'
import Card from '../../lib/models/card.model'
import withSession from '../../lib/session'

const CardPage = ({ cat }) => {
  useUser({ redirectTo: '/login', redirectIfFound: false })
  const router = useRouter()

  const { id } = router.query // get related card id
  const { categories, updateCard } = useCard(id) // get card structure & method to use to display changes

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
      {!categories && <Spinner />}
      {categories
        && <>
          <CardHeader />
          <div sx={{ bg: 'white', position: 'sticky', top: '70px', width: '100%', zIndex: 60 }}>
            <ul sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'body', mx: 'auto', px: 3 }}>
              {categories.map(category => (
                <li key={category._id}><a href={`#${ category._id }`}>{category.catName}</a></li>
              ))}
            </ul>
          </div>
          {categories.map((category, i) => (
            <Category
              key={i}
              cardId={id} // related card id for requests
              catName={category.catName}
              infoSet={category} // category structure with title, desc. etc...
              refresh={updateCard} // method to call after each update in db (post/put)
            />
          ))}
        </>
      }
      <div sx={{ variant: 'Add.category' }} onClick={addCategory}>Ajouter une catégorie</div>
    </div>
  )
}

export const getServerSideProps = withSession(async ({ req, res, params }) => {
  const session = req.session.get('user')
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  const user = await User.findById(session.userId)
  const card = await Card.findById(params.id)
  // if card not found or is not in user's restaurants, redirect.
  if (!card || user.restaurants.indexOf(card.restaurantId) === -1) return { redirect: { destination: '/cards', permanent: false } }
  return {
    props: {
      user: 'test',
    },
  }
})

export default CardPage

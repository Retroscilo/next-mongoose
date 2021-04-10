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
import Switch from '../../components/Switch'
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
  const router = useRouter()
  const [ clientView, setclientView ] = useState(false)
  useEffect(() => router.push(`/cards/${ router.query.id }?${ clientView ? 'client' : '' }`, undefined, { shallow: true }), [ clientView ])

  return (
    <div sx={{ width: '100%', bg: 'white' }}>
      <div sx={{ maxWidth: 'body', pl: mobile ? 2 : 3, m: '0 auto' }}>
        <div sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span sx={{ display: 'flex', alignItems: 'center' }}>
            {!(router.query.client === '') && <Link href="/cards">
              <a>
                <div
                  sx={{
                    position: 'relative',
                    background: 'url("/leftArrayCTA.svg") no-repeat',
                    width: '30px',
                    height: '30px',
                    backgroundSize: 'contain',
                    transition: 'transform 0.2s ease',
                    mr: 2,
                    '&::after': {
                      position: 'absolute',
                      content: '""',
                      display: 'inline-block',
                      background: 'url("/ArrayCTA__dash--black.svg") no-repeat',
                      backgroundSize: 'contain',
                      width: '25px',
                      height: '25px',
                      left: '8px',
                      opacity: 0,
                      top: 'calc(50% - 3px)',
                      transition: 'opacity 0.1s ease',
                    },
                    '&:hover': { transform: 'translateX(-10px)' },
                    '&:hover::after': { opacity: 1 },
                  }}
                />
              </a>
            </Link>}
            <h1>{restaurant.restaurantName}</h1>
          </span>
          <Switch
            isOn={clientView} label={'Vue client'}
            onClick={() => setclientView(!clientView)}
          />
        </div>
        <p>{restaurant.restaurantDescription}</p>
      </div>
    </div>
  )
}

const CardPage = ({ SSRcard, restaurant }) => {
  useUser({ redirectTo: '/login', redirectIfFound: false })
  const router = useRouter()
  const { id } = router.query
  const client = (router.query.client === '')

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
          {card.categories.map(category => (
            <Category
              client={client}
              key={category._id}
              cardId={card._id}
              structure={category} // category structure with title, desc. etc...
              refresh={updateCard} // method to call after each update in db (post/put)
            />
          ))}
          {!client && <div sx={{ variant: 'Add.category' }} onClick={addCategory}>Ajouter une catégorie</div>}
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

CardHeader.propTypes = {
  restaurant: propTypes.object,
}

CardPage.propTypes = {
  SSRcard: propTypes.object,
  restaurant: propTypes.object,
}

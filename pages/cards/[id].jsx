/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Front
import { jsx, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
import fetchWithId from '../../lib/fetchWithId'
import Menu from '../../components/card/Menu'
import propTypes from 'prop-types'
import { useEffect, useState } from 'react'
// Hooks
import useSwr from 'swr'
import useUser from '../../lib/hooks/useUser'
import { CardProvider, useCard } from '../../lib/hooks/useCard'

const CardEditor = () => {
  // Check if User connected, nor redirect
  useUser({ redirectTo: '/login', redirectIfFound: false })

  const router = useRouter()
  const { id } = router.query

  // Subscribe to card first, then load restaurant infos. Await for router to be ready client side.
  const { data: card, mutate: updateCard } = useSwr(id ? [ '/api/card/', id ] : null, fetchWithId)
  const [ restaurant, setRestaurant ] = useState(null)
  useEffect(async () => card && setRestaurant(await fetchJson('/api/restaurant/' + card.restaurantId)), [ card ])

  if (!restaurant || !card) return <div><Spinner /></div>
  return (
    <CardProvider>
      <Menu
        card={card}
        restaurant={restaurant}
        client={false}
        updateCard={updateCard}
      />
    </CardProvider>
  )
}

export default CardEditor

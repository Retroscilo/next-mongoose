/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
import Card from './Card'
import Tabs from './Tabs'
import { useRestaurants } from '../../lib/hooks/useRestaurants'
import fetchJson from '../../lib/fetchJson'

const RestaurantCard = () => {
  const { restaurants } = useRestaurants()
  const [ active, setActive ] = useState(restaurants[0])

  return (
    <Card>
      <h1 sx={{ position: 'absolute', color: 'white', top: '-70px', fontWeight: 'normal' }}>Restaurants</h1>
      <Tabs active={active} items={restaurants} setItem={setActive} action={restaurants.add} activeAction={!(restaurants.length > 2)} />
      <div sx={{ px: 4 }}>
        <h1 sx={{ fontWeight: 'normal' }}>{active.restaurantName}</h1>
        <p>{active.restaurantDescription}</p>
      </div>
    </Card>
  )
}

export default RestaurantCard

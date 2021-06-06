import React, { createContext, useContext } from 'react'
import fetchJson from '../../lib/fetchJson'

const restaurantsContext = createContext({})

export const RestaurantsProvider = ({ children, restaurants, mutate }) => (
  <restaurantsContext.Provider value={{ restaurants, mutate }}>{children}</restaurantsContext.Provider>
)

export const useRestaurants = () => {
  const { restaurants, mutate } = useContext(restaurantsContext)

  restaurants.add = async () => {
    await fetchJson('/api/restaurant', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    })
    mutate()
  }

  return { restaurants }
}

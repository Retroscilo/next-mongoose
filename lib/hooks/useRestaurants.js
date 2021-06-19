import React, { createContext, useContext, useState } from 'react'
import fetchJson from '../../lib/fetchJson'

const restaurantsContext = createContext({})

export const RestaurantsProvider = ({ children, restaurants, mutate }) => (
  <restaurantsContext.Provider value={{ restaurants, mutate }}>
    {children}
  </restaurantsContext.Provider>
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

  const useRestaurant = id => {
    const restaurant = restaurants.find(r => r._id === id)
    if (!restaurant) return

    const changeField = async (field, newValue) => {
      await fetchJson(`api/restaurant/${ restaurant._id }`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ field, newValue }),
      })
      mutate()
    }

    restaurant.changeName = async newValue => changeField('restaurantName', newValue)

    restaurant.changeDescription = async newValue => changeField('restaurantDescription', newValue)

    restaurant.remove = async () => {
      await fetchJson(`/api/restaurant/${ restaurant._id }`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
      })
      mutate()
    }

    restaurant.addCard = async () => {
      await fetchJson(`/api/restaurant/${ restaurant._id }`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      })
      mutate()
    }

    restaurant.useCard = id => {
      const card = restaurant.cards?.find(c => c.cardId === id)
      if (!card) return

      card.changeName = async newValue => changeField('cardName', newValue)

      return card
    }

    return restaurant
  }

  return { restaurants, useRestaurant }
}

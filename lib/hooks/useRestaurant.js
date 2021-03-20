import { useEffect } from 'react'
import useSWR from 'swr'
import fetchJson from '../fetchJson'

export default function useRestaurant (req) {
  const { data: restaurants, mutate: mutateRestaurant } = useSWR(`/api/restaurant`)
  const updateRestaurants = req => mutateRestaurant(fetchJson(`/api/restaurant`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  }))

  return { restaurants, updateRestaurants }
}

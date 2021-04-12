import useSwr from 'swr'
import fetchJson from '../fetchJson'

export default async function useRestaurant (id) {
  if (!id) return { loading: true }
  const { data: card, mutate: updateCard } = useSwr('/api/card/' + id, fetchJson)
  const restaurant = useSwr('/api/restaurant/' + card?.restaurantId)

  return { card, restaurant, updateCard, loading }
}

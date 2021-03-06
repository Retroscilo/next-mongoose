import useSWR from 'swr'
import fetchJson from '../fetchJson'

export default function useCard (cardId) {
  const { data: categories, mutate: mutateCard } = useSWR(`/api/category?id=${ cardId }`)
  const updateCard = () => mutateCard(fetchJson(`/api/category?id=${ cardId }`))
  return { categories, updateCard }
}

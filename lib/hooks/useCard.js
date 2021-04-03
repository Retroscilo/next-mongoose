import { useEffect } from 'react'
import useSWR from 'swr'
import fetchJson from '../fetchJson'
import Router from 'next/router'

export default function useCard (cardId) {
  const { data: categories, mutate: mutateCard } = useSWR(`/api/card/category?id=${ cardId }`)
  const updateCard = () => mutateCard(fetchJson(`/api/card/category?id=${ cardId }`))
  return { categories, updateCard }
}

import React, { useEffect, useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import useSwr from 'swr'
import { useRouter } from 'next/router'
import fetchWithId from '../../lib/fetchWithId'
import fetchJson from '../../lib/fetchJson'

const cardContext = createContext({})

export const CardProvider = ({ children }) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <cardContext.Provider value={id}>{children}</cardContext.Provider>
  )
}

export const useCard = () => {
  const id = useContext(cardContext)
  const { data: card, mutate: updateCard } = useSwr(id ? [ '/api/card/', id ] : null, fetchWithId)

  card.addCategory = async () => {
    const body = { id }
    await fetchJson('/api/card/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await updateCard()
  }

  function useCategory (catId) {
    const category = card.categories.find(c => c._id === catId)

    category.update = async (field, value) => {
      const body = { cardId: id, catId, field, value }
      await fetchJson('/api/card/category', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    category.delete = async () => {
      const body = { cardId: id, catId }
      await fetchJson('/api/card/category', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    category.addProduct = async () => {
      const body = { cardId: id, catId }
      await fetchJson('/api/card/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    return { category, useProduct }
  }

  async function useProduct (catId, prodId) {
    const card = await updateCard()
    const product = card.categories.find(c => c._id === catId).products.find(prod => prod._id === prodId)

    product.update = async (field, value) => {
      const body = { cardId: id, catId, prodId, field, value }
      await fetchJson('/api/card/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    product.delete = async () => {
      await fetchJson('/api/card/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: id, catId, prodId }),
      })
      await updateCard()
    }

    return product
  }

  return { card, categories: card.categories, useCategory, updateCard, useProduct }
}

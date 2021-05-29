import React, { useEffect, useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import useSwr from 'swr'
import { useRouter } from 'next/router'
import fetchWithId from '../../lib/fetchWithId'
import fetchJson from '../../lib/fetchJson'
import { arrayMove } from '@dnd-kit/sortable'

const dummyProduct = {
  _id: 'preload',
  prodName: 'Nouveau produit',
  prodDescription: 'description',
  prodPrice: '3',
  labels: [ 'homemade' ],
}

const dummyCategory = {
  _id: 'preload',
  catName: 'Nouvelle Categorie',
  catDescription: 'description',
  products: [ dummyProduct ],
}

const cardContext = createContext({})

export const CardProvider = ({ children, card, updateCard }) => (
  <cardContext.Provider value={{ card, updateCard }}>{children}</cardContext.Provider>
)

export const useCard = () => {
  const { card, updateCard } = useContext(cardContext)
  const cardId = card._id

  card.addCategory = async () => {
    const body = { id: card._id }
    await fetchJson('/api/card/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await updateCard()
  }

  function useCategory (catId) {
    const category = card.categories.find(c => c._id === catId)
    if (!category) return

    category.update = async (field, value) => {
      const body = { cardId, catId, field, value }
      await fetchJson('/api/card/category', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    category.delete = async () => {
      const body = { cardId, catId }
      updateCard({
        ...card,
        categories: card.categories.filter(cat => cat._id !== catId),
        catOrder: card.catOrder.filter(id => id !== catId),
      }, false)
      await fetchJson('/api/card/category', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    category.addProduct = async () => {
      const body = { cardId, catId }
      await fetchJson('/api/card/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    category.moveProducts = async newOrder => {
      const newCat = card.categories.find(cat => cat._id === catId)
      newCat.prodOrder = newOrder
      updateCard({
        ...card,
        categories: [
          ...card.categories.filter(cat => cat._id !== catId),
          newCat,
        ],
      }, false)
      await fetch('/api/card/order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cardId, catId, newOrder }),
      })
      // await updateCard()
    }

    return category
  }

  function useProduct (catId, prodId) {
    const product = card.categories.find(c => c._id === catId).products.find(prod => prod._id === prodId)

    product.update = async (field, value) => {
      const body = { cardId, catId, prodId, field, value } 
      await fetchJson('/api/card/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await updateCard()
    }

    product.delete = async () => {
      const cat = card.categories.find(cat => cat._id === catId)
      cat.prodOrder = cat.prodOrder.filter(id => id !== prodId)
      cat.products = cat.products.filter(p => p._id !== prodId)
      updateCard({
        ...card,
        categories: [
          ...card.categories.filter(c => c._id !== catId),
          cat,
        ],
      }, false)
      await fetchJson('/api/card/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, catId, prodId }),
      })
      await updateCard()
    }

    return product
  }

  return {
    card,
    categories: card.categories,
    updateCard,
    useCategory,
    useProduct,
  }
}

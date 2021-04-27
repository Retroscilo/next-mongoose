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
  console.log(id)

  const { data: card, mutate: updateCard } = useSwr(id ? [ '/api/card/', id ] : null, fetchWithId)

  return (
    <cardContext.Provider value={ card }>
      {children}
    </cardContext.Provider>
  )
}

export const useCard = () => {
  const card = useContext(cardContext)
  return card
}

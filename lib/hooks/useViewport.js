import React, { useEffect, useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const viewportContext = createContext({})

export const ViewportProvider = ({ children }) => {
  if (typeof window === 'undefined') return (
    <viewportContext.Provider>
      {children}
    </viewportContext.Provider>
  )
  const [ width, setWidth ] = useState(window.innerWidth)
  const [ height, setHeight ] = useState(window.innerHeight)
  let timeout = false

  const handleWindowResize = () => {
    if (timeout) return
    timeout = true
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
    setTimeout(() => { timeout = false }, 100)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  )
}

export const useViewport = () => {
  if (typeof window === 'undefined') return {}
  const { width, height } = useContext(viewportContext)
  return { width, height }
}

ViewportProvider.propTypes = {
  children: PropTypes.object,
}

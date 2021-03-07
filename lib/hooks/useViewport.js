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

  const handleWindowResize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
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
  const { width, height } = useContext(viewportContext)
  return { width, height }
}

ViewportProvider.propTypes = {
  children: PropTypes.object,
}

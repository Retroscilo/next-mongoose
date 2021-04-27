import React, { useEffect, useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const viewportContext = createContext({})

export const ViewportProvider = ({ children }) => {
  const [ windowDimensions, setWindowDimensions ] = useState({
    width: undefined,
    height: undefined,
  })
  let timeout = false
  useEffect(() => {
    function handleResize () {
      if (timeout) return
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      timeout = true
      setTimeout(() => { timeout = false }, 100)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <viewportContext.Provider value={windowDimensions}>
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

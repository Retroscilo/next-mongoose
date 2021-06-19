import React, { createContext, useContext } from 'react'

const InputContext = createContext({})

const InputContextProvider = ({ value, children }) => (
  <InputContext.Provider value={value}>{children}</InputContext.Provider>
)

const useInputContext = () => {
  const context = useContext(InputContext)
  return context
}

export { InputContextProvider, useInputContext }

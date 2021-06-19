import React, { createContext, useContext } from 'react'

const TabsContext = createContext({})

export const TabsContextProvider = ({ children, value }) => (
  <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
)

export const useTabsContext = () => {
  const context = useContext(TabsContext)
  return context
}

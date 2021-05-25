import React, { useEffect, useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const themeContext = createContext({})

export const ThemeProvider = ({ children, theme }) => (
  <themeContext.Provider value={theme} >{children}</themeContext.Provider>
)

export const useTheme = () => {
  const theme = useContext(themeContext)
  return { theme, backgrounds: theme.backgrounds }
}

ThemeProvider.propTypes = {
  children: PropTypes.object,
  theme: PropTypes.object,
}

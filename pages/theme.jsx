/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Styled, Spinner } from 'theme-ui'
import { useEffect, useState, useRef, createContext, useContext } from 'react'

const FAAC = ({ children }) => {
  const text = 'text'
  return (
    <div sx={{ bg: 'white' }}>
      {children(text)}
    </div>
  )
}

const theme = () => {
  const [ value, setValue ] = useState('Une description ?')

  const handleSubmit = async e => {
    e.preventDefault()
  }
  return (
    <div>
      <FAAC>{text => <div>{text}</div>}</FAAC>
    </div>
  )
}

export default theme

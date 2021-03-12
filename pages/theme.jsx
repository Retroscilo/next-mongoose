/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const theme = () => {
  useEffect(() => console.log(window))
  const [ value, setValue ] = useState('Une description ?')

  return (
    <div>
      <Styled.h1>Lorem Ipsum</Styled.h1>
      <h2 sx={{ variant: 'styles.h2' }} >Lorem Ipsum</h2>
      <h3 sx={{ variant: 'styles.h3' }} >Lorem Ipsum</h3>
      <h4 sx={{ variant: 'styles.h4' }} >Lorem Ipsum</h4>
      <h5 sx={{ variant: 'styles.h5' }} >Lorem Ipsum</h5>
      <h6 sx={{ variant: 'styles.h6' }} >Lorem Ipsum</h6>
      <span sx={{ fontSize: 1 }}>W</span>
      <div
        contenteditable="true"
        onBlur={e => console.log('e')}
        value={value}
        onChange={e => setValue(e.target.value)}
        sx={{ width: 'fit-content', minWidth: '200px', maxWidth: '380px' }}
      >
        Une Description ?
      </div>
    </div>

)}

export default theme

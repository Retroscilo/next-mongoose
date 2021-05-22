/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Styled, Spinner } from 'theme-ui'
import { useEffect, useState, useRef, createContext, useContext } from 'react'
import { motion, AnimateSharedLayout } from 'framer-motion'

export const generateCode = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) token += characters[Math.floor(Math.random() * characters.length)]
  return token
}

const theme = () => {
  const [ value, setValue ] = useState('Une description ?')
  const order = [ 1, 2, 3, 4 ]
  const handleSubmit = async e => {
    e.preventDefault()
  }
  return (
    <AnimateSharedLayout>
      <div sx={{ display: 'grid', gridTemplateColumns: '75px 75px 75px 75px', gridGap: '10px', mx: 'auto', width: '200px' }}>
        {order.map(s => (
          <motion.div
            layoutId="product"
            key={generateCode()}
            drag
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.9}
            onDrag={(e, info) => {
              info.offset.x > 90 && e.target.style.order++
              info.offset.x < -90 && e.target.style.order--
            }}
            onDragStart={e=> e.target.style.zIndex = 9000}
            onDragEnd={e => e.target.style.zIndex = 1}
            className={'square'}
            sx={{ width: '75px', height: '75px', bg: 'crimson', order: s }}
          >
            {s}
          </motion.div>
        ))}
      </div>
    </AnimateSharedLayout>
  )
}

export default theme

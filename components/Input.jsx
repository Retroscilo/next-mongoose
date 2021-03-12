/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import theme from '../theme'

const Input = ({ defaultValue, update, variant, field, width='100%' }) => {
  const [ value, setValue ] = useState(defaultValue)
  useEffect(() => setValue(defaultValue), [ defaultValue ])

  const handleBlur = e => {
    if (e.target.innerHTML.trim() === '') { e.target.innerHTML = defaultValue; return }
    if (e.target.innerHTML !== defaultValue) update(field, e.target.innerHTML)
  }
  
  return (
    <motion.div
    contentEditable="true"
    suppressContentEditableWarning={true}
    sx={{ 
      position: 'relative',
      variant: `Input.${ variant }`,
      gridArea: field,
      display: 'block',
      width,
      border: 'none',
      borderRadius: '3px',
      bg: 'inherit',
      '&:focus': { outline: 'none' },
      pl: field == 'prodPrice' ? '12px' : 0,
      lineHeight: 1.2,
      '&::before': (field == 'prodPrice' ? { content: "'€'", variant: 'text.light', fontSize: 1, position: 'absolute', top: '1px', left: '0' } : '')
    }}
    name="price"
    type="text"
    onBlur={handleBlur}
    value={value}
    whileHover={{ boxShadow: '0 0 0 1px rgb(212, 212, 212)' }}
    whileFocus={{ boxShadow: `0 0 2px .5px ${theme.colors.primary}` }}
    transition={{ boxShadow: { duration: 0.2, ease: 'linear' }, outline: { duration: 0.2, ease: 'linear' } }}
    >{defaultValue}</motion.div>
  )
}

export default Input

Input.propTypes = {
  defaultValue: PropTypes.string,
  field: PropTypes.string,
  update: PropTypes.func,
  variant: PropTypes.string,
  w: PropTypes.number,
}

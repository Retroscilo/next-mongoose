/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Input = ({ defaultValue, update, variant, field }) => {
  const [ value, setValue ] = useState(defaultValue)
  useEffect(() => setValue(defaultValue), [ defaultValue ])

  const handleBlur = e => {
    if (e.target.value.trim() === '') { e.target.value = defaultValue; return }
    if (e.target.value !== defaultValue) update(field, e.target.value)
  }

  return (
    <input
      sx={{ variant: `Input.${ variant }`, border: 'none', bg: 'inherit', width: 'fit-content', '&:focus': { outline: 'none' } }}
      type="text"
      onBlur={handleBlur}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

export default Input

Input.propTypes = {
  defaultValue: PropTypes.string,
  field: PropTypes.string,
  update: PropTypes.func,
  variant: PropTypes.string,
}

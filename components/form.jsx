/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const Input = ({ field, displayError }) => {
  const input = useRef(null)
  const [ isFocus, setIsFocus ] = useState(false)
  useEffect(() => (input.current.value.length > 0) && setIsFocus(true), [])
  const [ isError, setIsError ] = useState(displayError)
  useEffect(() => displayError && field.check && !field.check(input.current.value) && setIsError(true), [displayError])

  const handleBlur = e => e.target.value === '' && setIsFocus(false)

  const handleChange = e => {
    field.check && field.check(e.target.value) && setIsError(false)
    field.check && !field.check(e.target.value) && displayError && setIsError(true)
  }

  return (
    <span sx={{ 
      position: 'relative',
      my: 3,
      width: '100%', 
      '&::after': { 
        content: `"${field.legend || ''}"`,
        fontSize: 0,
        color: 'textLight'
      }
      }}
    >
      <label
        htmlFor={field.name}
        sx={{
          position: 'absolute',
          left: 0,
          pointerEvents: 'none',
          fontSize: isFocus ? 0 : 2,
          top: isFocus ? '-15px' : 0,
          transition: 'all 0.1s ease-in-out',
          width: '100%',
          color: 'textLight',
          '&::after': { 
            content: `"${field.error || ''}"`,
            right: 0,
            opacity: isError ? 1 : 0,
            position: 'absolute',
            color: 'crimson',
            transition: 'opacity 0.2s ease-in-out'
          },
        }}
      >
        {field.name}
      </label>
      <input
        ref={input}
        sx={{
          bg: 'transparent',
          border: 'none',
          borderBottom: isError ? '1px solid crimson' : '1px solid lightgrey',
          width: '100%',
          transition: 'border 0.2s ease-in-out',
          fontSize: 2,
          '&:focus': {
            outline: 'none',
          },
        }}
        type={field.type}
        name={field.name}
        onFocus={() => setIsFocus(true)}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </span>
  )
}

const Form = ({ onSubmit, children, fields, title, subTitle, errorMessage }) => {
  const [ displayError, setDisplayError ] = useState(false)
  const handleSubmit = e => {
    e.preventDefault()

    // check if all field are valids and allow errors to display if not
    if (!fields.every(field => field.check ? field.check(e.currentTarget[field.name].value) : true)) return setDisplayError(true)
    
    onSubmit(e)
  }

  return (
    <div sx={{ variant: 'Form.default' }}>
      <h2 sx={{ alignSelf: 'flex-start' }}>{title}</h2>
      {subTitle && <p sx={{ variant: 'text.light', m: 0, mb: 3, alignSelf: 'flex-start'}}>{subTitle}</p>}
      <form onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {fields.map((field, i) => (
          <Input key={i} field={field} displayError={displayError} />
        ))}
        {children}
        {errorMessage && <span sx={{ alignSelf: 'flex-start', mt: 3, color: 'crimson' }}>{errorMessage}</span>}
      </form>
    </div>
  )
}

export default Form

Form.propTypes = {
  children: PropTypes.object,
  errorMessage: PropTypes.string,
  fields: PropTypes.array,
  title: PropTypes.string,
  onSubmit: PropTypes.func,
}

Input.propType = {
  field: PropTypes.object,
}

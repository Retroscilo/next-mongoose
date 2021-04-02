/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { motion, useAnimation } from 'framer-motion'
import theme from '../theme'

const ErrorInfo = ({ error }) => {
  return (
    <motion.div
      animate={{ y: 22, opacity: 1 }}
      sx={{
        opacity: 0,
        fontSize: 1,
        position: 'absolute',
        transformOrigin: 'top',
        bg: 'white',
        boxShadow: 'low',
        borderRadius: '3px',
        p: '1px',
        pl: 1,
        pr: 1,
        zIndex: 20,
        width: 'fit-content',
        maxWidth: '400px',
        minWidth: '200px',
        textAlign: 'center',
        top: 0,
        '&::before': { 
          content: "'!'",
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'accent',
          color: 'white',
          width: '11.5px',
          height: '12px',
          textAlign: 'center',
          mr: 1,
          borderRadius: '100px',
          pl: '.5px',
        }
      }}
    >
      {error}
    </motion.div>
  )
}

const Input = ({ defaultValue, update, variant, field, options }) => {
  const [ error, setError ] = useState(false)
  const pulseControls = useAnimation()
  const handleError = message => {
    pulseControls.start([ null, 'red' ])
    setError(message)
  }

  // prevent new line if user press enter / prevent user to type letters in price input
  const handleKeyPress = e => {
    e.key === "Enter" && e.preventDefault()
    if (options?.inputMatch && String.fromCharCode(e.which).match(options.inputMatch)) e.preventDefault()
  }

  // maxChar error
  const handleKeyUp = e => {
    if(e.target.innerText.length > (options?.max || 999)) return handleError(`${options?.max} charactères maximum (${e.target.innerText.length}/${options?.max})`)
    else setError(false)
    e.key === "Enter" && e.target.blur()
  }

  // empty field Error
  const handleBlur = async e => {
    if (options?.empty?.prevent && e.target.innerText.length == 0) return handleError(options?.empty?.err || 'Vous devez remplir ce champ !')
    /* if (options?.validator != undefined && !options?.validator?.match(e.target.innerHTML)) return handleError(options.validator.err || 'Vérifiez votre saisie !') */
    if (e.target.innerHTML !== defaultValue && !error) {
      try {
        await update(field, e.target.innerText)
        pulseControls.start([ null, 'green' ])
        setError(false)
      } catch (err) {
        console.log(err?.data?.body)
        typeof err?.data?.body === 'string' ? handleError(err.data.body) : handleError('Something went wrong')
      }
    } else if (e.target.innerHTML === defaultValue) setError(false)
  }

  return (
    <span sx={{ position: 'relative', gridArea: options?.gridArea || '', cursor: 'default'}}>
    <motion.div
      contentEditable="true"
      suppressContentEditableWarning={true}
      suppressErrors={true}
      variants={{ 
        green: {
          boxShadow: [ '0 0 0 1px rgb(212, 212, 212)', '0 0 0 1.5px rgb(119, 219, 123)', '0 0 0 0px rgb(212, 212, 212)' ],
          transition: { duration: 0.6, times: [ 0, 0.1, 1 ] }
        },
        red: {
          boxShadow: [ null, '0 0 0 1.5px rgb(255, 77, 77)' ],
          transition: { duration: 0.4 }
        }
      }}
      sx={{ 
        position: 'relative',
        variant: `Input.${ variant }`,
        display: 'block',
        width: options?.width || '100%',
        maxHeight: '313px',
        overflow: 'auto',
        maxHeight: '38px',
        border: 'none',
        borderRadius: '3px',
        bg: 'inherit',
        '&:focus': { outline: 'none' },
        pl: options?.label ? '12px' : 1,
        pr: options?.after ? '18px' : 1,
        lineHeight: 1.2,
        '&::before': { content: `"${options?.label || ''}"`, variant: 'text.light', fontSize: 1, position: 'absolute', top: '1px', left: '0' },
        '&::after': { content: `${options?.after || '""'}`, position: 'absolute', right: 0, }
      }}
      onFocus={e => {
        e.preventDefault()
        e.stopPropagation()
        setTimeout(() => {
          document.execCommand('selectAll',false,null)
        }, 150);
      }}
      onClick={e => e.stopPropagation()}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      onKeyPress={handleKeyPress}
      animate={pulseControls}
      whileHover={ !error && { boxShadow: '0 0 0 1px rgb(212, 212, 212)' }}
      whileFocus={ !error && { boxShadow: `0 0 2px .5px ${theme.colors.primary}` }}
      transition={{ boxShadow: { duration: 0.2, ease: 'linear' }, outline: { duration: 0.2, ease: 'linear' } }}
    >
      {defaultValue}
    </motion.div>
    {error && <ErrorInfo error={error} />}
    </span>
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

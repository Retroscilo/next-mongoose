/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useEffect, useState, Profiler, useCallback, useMemo } from 'react'
import { InputContextProvider } from './useInputContext'
import { Label } from './components/Label'
import styles from './Input.module.css'
import { onBlur, onKeyPress, onKeyUp } from './modifiers'
import Tooltip from '../../misc/Tooltip'

const Input = ({ children, size = 'M', callback, modifiers, maxChar, matcher, style, ariaLabel, spellCheck = false }) => {
  const [ error, setError ] = useState(false)
  const [ displayTooltip, setDisplayTooltip ] = useState(false)
  useEffect(() => error && setDisplayTooltip(true), [ error ])
  const [ success, setSuccess ] = useState(false)
  useEffect(() => success && setTimeout(() => setSuccess(false), 400), [ success ])
  const value = useMemo(() => children)

  const handleBlur = async e => {
    for (const modifier in onBlur) (modifiers?.indexOf(modifier) !== -1) && onBlur[modifier](e)
    if (error) { setDisplayTooltip(false); return }
    if (value === e.target.innerText) return
    try {
      await callback(e.target.innerText)
      setSuccess(true)
    } catch (e) {
      setError('erreur')
    }
  }
  const handleKeyPress = e => {
    for (const modifier in onKeyPress) (modifiers?.indexOf(modifier) !== -1) && onKeyPress[modifier](e)
  }
  const handleKeyUp = e => {
    for (const modifier in onKeyUp) (modifiers?.indexOf(modifier) !== -1) && onKeyUp[modifier](e)
    if (maxChar && (e.target.innerText.length > maxChar)) setError(`${ maxChar } charactères maximum ! (${ e.target.innerText.length }/${ maxChar })`)
    else setError(false)
  }
  return (
    <InputContextProvider value={{ maxChar, matcher, error, setError, modifiers }}>
      <Tooltip tip={(error && typeof error !== 'boolean') && <><Tooltip.Label />{error}</>} display={displayTooltip} position="bottom-left" color="#FF4D4D" >
        <div
          type="text"
          role={'input'}
          spellCheck={spellCheck}
          aria-label={ariaLabel}
          className={`${styles.default} ${styles[size]} ${success && styles.success} ${error && styles.error}`}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onKeyUp={handleKeyUp}
          onClick={e => e.stopPropagation()}
          onFocus={() => setDisplayTooltip(true)}
          style={style}
        >
          {children}
        </div>
      </Tooltip>
    </InputContextProvider>
  )
}

Input.Label = Label

export default Input

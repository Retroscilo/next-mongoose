/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Tooltip.module.css'
import { Label } from './Label'

const Tooltip = ({ children, tip, display, position = 'top-center', color = 'black' }) => {
  const [ subject, setSubject ] = useState(0)
  const [ tooltip, setTooltip ] = useState(0)
  const [ visible, setVisible ] = useState(false)
  const [ bottom ] = useState(position.search('bottom') !== -1)
  const handleMouseEnter = () => setVisible(true)
  const handleMouseLeave = () => setVisible(false)

  const tooltTipRef = useCallback(node => {
    if (!node) return
    setTooltip(node.getBoundingClientRect())
  }, [ tip ])

  const tooltipSubject = useCallback(node => {
    if (!node) return
    setSubject(node.getBoundingClientRect())
  }, [ children ])

  return (
    <span
      ref={tooltipSubject}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span
        className={`${ styles.tooltip } ${ (visible || display) && 'visible' } ${ position } `}
        ref={tooltTipRef}
        style={{ color }}
      >
        {tip}
      </span>
      <style jsx>{`
      .visible
        opacity: 1
        transform: translateY(${ bottom ? 20 : -25 }px)
        padding: ${ !children.props.tip && 0 }
        transition: transform .2s ease, opacity .2s ease
      .top-center 
        top: ${ subject.top }px
        left: calc(${ subject.left + (subject.width/2) }px - ${ tooltip.width/2 - 8 }px)
      .top-left
        top: ${ subject.top }px
        left: ${ subject.left }px
      .bottom-left
        top: ${ subject.bottom }px
        left: ${ subject.left }px
    `}</style>
    </span>
  )
}

Tooltip.Label = Label

export default Tooltip
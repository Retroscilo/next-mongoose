/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import { motion } from 'framer-motion'
import useIsMount from '../../lib/hooks/useIsMount'
import { useTheme } from '../../lib/hooks/useTheme'

const DownArrow = ({ fillColor, display }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 34 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.2501 13.7145L4.24274 0.707169C3.85211 0.316605 3.21906 0.316605 2.82843 0.707169L0.707092 2.82845C0.316711 3.21901 0.316711 3.85213 0.707092 4.24269L16.2635 19.799C16.3375 19.8731 16.4205 19.9331 16.5086 19.9791L16.5755 20.046C16.9661 20.4365 17.5992 20.4365 17.9898 20.046L33.5462 4.48964C33.9366 4.09908 33.9366 3.46596 33.5462 3.07539L31.4249 0.954117C31.0342 0.563553 30.4012 0.563553 30.0106 0.954117L17.2501 13.7145Z" fill={fillColor || 'black'}
    />
    <style jsx>{`
      svg {
        transition: transform .2s ease
        margin-left: 7px
        transform: ${ display ? 'rotate(180deg)' : '' }
      }
    `}</style>
  </svg>
)

const optionsBox = ({ children, label, bold, options = {} }) => {
  const Opt = {
    position: 'right',
    gap: '30px',
    ...options,
  }
  const [ display, setDisplay ] = useState(false)
  const optionsBox = useRef(null)
  useClickOutside(optionsBox, () => setDisplay(false))

  return (
    <div
      sx={{ position: 'relative', cursor: 'pointer', width: 'fit-content', boxShadow: '0 0 0pt 1pt rgba(228, 228, 228, 0)', transition: 'all .2s ease', color: 'body', px: 1, pb: 0, borderRadius: '3px', whiteSpace: 'nowrap' }}
      ref={optionsBox}
      onClick={() => setDisplay(!display)}
    >
      <span sx={{ fontWeight: bold ? 'bold' : 'regular' }}>{label}</span>
      <DownArrow display={display} />
      <div className={display ? 'ulWrapper display' : 'ulWrapper'}>
        <ul sx={{ boxShadow: 'low', maxHeight: '300px', overflow: 'auto' }}>
          {children}
        </ul>
      </div>

      <style jsx>{`
        .ulWrapper
          pointer-events: none
          cursor: default
          position: absolute
          ${ Opt.position }: 0
          opacity 0
          transform translateY(-20px)
          transition all .1s ease-in-out
          ${ Opt.position === 'center' ? `left: 50%` : '' }
          
        ul
          position: relative
          background: white
          border-radius: 3px
          top: 20px
          padding: ${ Opt.gap }
          ${ Opt.position === 'center' ? `left: -50%` : '' }
          
        ul > :global(li:not(:first-of-type))
          margin-top ${ Opt.gap }

        ul > :global(li):hover
          filter: brightness(0.8)
        
        .display
          pointer-events: initial
          opacity: 1
          transform: translateY(0)
      `}</style>
    </div>
  )
}

export default optionsBox

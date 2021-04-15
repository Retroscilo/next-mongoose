/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef } from 'react'
import { useClickOutside } from '../../lib/hooks/useClickOutside'

const optionsBox = ({ children, label, options = {} }) => {
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
      sx={{ position: 'relative', cursor: 'pointer', width: 'fit-content' }}
      ref={optionsBox}
      onClick={() => setDisplay(!display)}
    >
      {label}
      <div className={display ? 'ulWrapper display' : 'ulWrapper'}>
        <ul sx={{ boxShadow: 'low' }}>
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

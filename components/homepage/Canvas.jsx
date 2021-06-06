/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import React, { useRef, useLayoutEffect, useEffect, forwardRef, useState } from "react";
import ReactDOM from "react-dom";
import { motion, useAnimation } from "framer-motion";
import { useViewport } from '../../lib/hooks/useViewport'

function Grid ({ color, height= 500 }) {
  const a = useRef(null)
  const b = useRef(null)
  const [ c, setC ] = useState(color)
  const [ translated, setTranslated ] = useState(false)
  const [ nextC, setNextC ] = useState(color)
  const [ counter, setCounter ] = useState(2)

  useEffect(() => {
    if (color != c) {
      setNextC(color)
      setCounter(counter + 1)
      b.current.style.fill = color
      setTranslated(true)
      setTimeout(() => {
        setTranslated(false)
        a.current.style.fill = color
        setC(color)
      }, 500)
    }
  }, [ color ])

  return (
    <div sx={{ position: 'absolute', height: `${height}px`, width: '100%' }}>
      <svg className={'svg' } preserveAspectRatio="none" width={'100%'} height={height} viewBox={'0 0 100 100'} xmlns="http://www.w3.org/2000/svg">
        <path ref={a} d="M0 0 L100 0 L100 100 L0 70 L0 0" fill={c} />
      </svg>
      <svg className={translated ? 'svg translated' : 'svg' } sx={{ transition: 'transform .3s ease', transform: 'translateY(-500px)' }} preserveAspectRatio="none" width={'100%'} height={height} viewBox={'0 0 100 100'} xmlns="http://www.w3.org/2000/svg">
        <path ref={b} d="M0 0 L100 0 L100 100 L0 70 L0 0" fill={c} />
      </svg>
      <style jsx>{`
        .svg
          position absolute
          top 0
          left 0
          z-index 0
          transition transform .5s ease

        .translated
          z-index 1
          transform translateY(0px)
          
      `}</style>
    </div>
  )
}

export default Grid

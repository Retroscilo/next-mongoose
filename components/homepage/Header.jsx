/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useEffect, useState } from 'react'
import Mockup from './Mockup'
import Canvas from './Canvas'

const Button = ({ color, selected, ...props }) => (
  <li
    {...props}
    sx={{
      position: 'relative',
      bg: color,
      width: '36px',
      height: '36px',
      borderRadius: '150px',
      cursor: 'pointer',
    }}
  >
    <div
      sx={{
        position: 'absolute',
        width: '50px',
        height: '50px',
        left: 'calc(50% - 25px)',
        top: 'calc(50% - 25px)',
        borderRadius: '150px',
        border: `3px solid ${color}`,
        transform: selected ? 'scale(1)' : 'scale(.4)',
        transition: 'transform .2s ease',
      }}
    />
  </li>
)

const Header = () => {
  const [ textColor, setTextColor ] = useState('limegreen')
  const [ color, setColor ] = useState('royalblue')
  const [ frame, setFrame ] = useState('blue')
  const correspondance = {
    blue: 'royalblue',
    yellow: 'gold',
    green: 'lightgreen'
  }
  
  const set = frame => {
    setFrame(frame)
    setColor(correspondance[frame])
  }

  return (
    <div sx={{ position: 'relative', mb: 6 }}>
      <div sx={{ position: 'absolute', top: '-5px', width: '100%' }}><Canvas color={color} /></div>
      <div sx={{ position: 'relative', top: '50px', maxWidth: 'body', mx: 'auto', zIndex: 2, color: 'white' }}>
        <h1 sx={{ position: 'relative', my: 1, fontSize: 8, fontWeight: 'normal', '&::after': { content: '""', width: '18%', height: '7px', background: textColor, display: 'inline-block', position: 'absolute', bottom: '4px', left: '80px' } }}>Qarte</h1>
        <h2 sx={{ fontSize: '2.5rem', fontWeight: 'lighter' }}>Créez un menu digital <br /><span sx={{ color: textColor }}>qui vous correspond</span></h2>
        <div sx={{ bg: textColor, color: 'white', px: 3, py: 1, width: 'fit-content', borderRadius: '50px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 2, mt: '62px' }}>
        C'est parti !
      </div>
      </div>
      
      <span sx={{ position: 'absolute', top: '100px', right: '150px', width: '265px' }}>
        <Mockup frame={frame} />
        <nav sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 3, px: 4 }}>
          <Button color={'royalblue'} selected={color === 'royalblue'} onClick={() => set('blue')} />
          <Button color={'gold'} selected={color === 'gold'} onClick={() => set('yellow')} />
          <Button color={'lightgreen'} selected={color === 'lightgreen'} onClick={() => set('green')} />
        </nav>
      </span>
     
    </div>
  )
}

export default Header
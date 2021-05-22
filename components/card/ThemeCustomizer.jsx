/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

import { jsx, Spinner } from 'theme-ui'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import { useTheme } from '../../lib/hooks/useTheme'
import fetchJson from '../../lib/fetchJson'

/* const Miniature = props => (

) */

const BackgroundSelection = ({ cardId, usedBackground, close, refresh }) => {
  const { name, backgrounds } = useTheme()
  const [ background, setBackground ] = useState(usedBackground || backgrounds[0])
  const [ loading, setLoading ] = useState(false)

  function nameFormater (name) {
    return name.replace('-', ' ')
  }

  const selectBackground = async bg => {
    setBackground(bg)
    setLoading(bg)
    try {
      await fetchJson('/api/card/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, background: bg }),
      })
      refresh()
      setTimeout(() => close(), 300)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 sx={{ m: 0, mb: 3, whiteSpace: 'nowrap', fontWeight: 'normal' }}>Arrière plan</h1>
      <span sx={{ display: 'grid', gridTemplateColumns: '108px 108px 108px', gridGap: 2 }}>
        {backgrounds.map((bg, i) => (
          <span
            key={i}
            sx={{ borderRadius: '3px', cursor: 'pointer', p: 2, bg: background === bg && '#EFEFEF', transition: 'all .2s ease', '&:hover': { background: '#EFEFEF' }, position: 'relative' }}
            onClick={() => selectBackground(bg)}
          >
            {loading === bg && <span sx={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}><Spinner /></span>}
            <Image
              src={`/themes/${ name }/backgrounds/${ bg }.jpg`}
              width={100}
              height={120}
            />
            <h2 sx={{ fontSize: 0, textAlign: 'center', my: 1, fontWeight: 'normal' }}>{nameFormater(bg)}</h2>
          </span>
        ))}
      </span>
    </div>
  )
}

const ThemeCustomizer = ({ cardId, theme, updateCard }) => {
  const { backgrounds } = useTheme() // current theme differents backgrounds
  const [ selected, setSelected ] = useState(null)
  const customizer = useRef(null)
  const closeCustomizer = () => setSelected(null)
  useClickOutside(customizer, closeCustomizer)
  const selectParameter = e => {
    e.stopPropagation()
    setSelected(e.target.alt)
    if (selected === e.target.alt) closeCustomizer()
  }
  return (
    <div ref={customizer} sx={{ position: 'relative' }}>
      <ul sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <li
          className={`iconContainer ${ selected === 'theme' && 'isSelected' }`}
          sx={{ '&::after': { content: '"thème"' } }}
          onClick={selectParameter}
        >
          <Image
            width={25}
            height={25}
            alt={'theme'}
            src={'/themeCustomizer/theme.svg'}
          />
        </li>
        <li
          className={`iconContainer ${ selected === 'background' && 'isSelected' }`}
          sx={{ '&::after': { content: '"arrière-plan"' } }}
          onClick={selectParameter}
        >
          <Image
            width={25}
            height={25}
            alt={'background'}
            src={'/themeCustomizer/background.svg'}
          />
        </li>
      </ul>
      <div
        className={(selected && 'visible') + ' optionsCard'}
        sx={{ background: 'white', borderRadius: '3px', boxShadow: 'low', position: 'absolute', top: '58px', zIndex: 9000, p: 4 }}
      >
        {selected === 'background' && 
        <BackgroundSelection usedBackground={theme.background} close={closeCustomizer} cardId={cardId} refresh={updateCard} />}
      </div>
      <style jsx>{`
        .optionsCard
          opacity 0
          transform translateY(-5px)
          transition all .2s ease
          pointer-events: none

        .visible
          pointer-events initial
          opacity: 1
          transform translateY(0)

        .iconContainer
          position relative
          border-radius 100px
          width 30px
          height 30px
          display flex
          margin-right 5px
          justify-content center
          align-items center
          transition background .2s ease

          &::after
            color: black
            position absolute
            top -80%
            display inline-block
            padding 2px 7px
            border-radius 3px
            font-size 13px
            opacity 0
            transform translateY(5px)
            transition all .3s ease
            white-space nowrap
            pointer-events none

          &.isSelected
            background: #E1E1E1
            &::before
              content ''
              top 28px
              width 15px
              height 15px
              position absolute
              background url('/themeCustomizer/decorativeArrow.svg')
              background-size contain
              background-color: transparent
              z-index 9001
              display inline-block

          &:hover
            background: #E1E1E1
            cursor: pointer
            &::after
              opacity 1
              transform translateY(0)

        `}</style>
    </div>
  )
}

export default ThemeCustomizer

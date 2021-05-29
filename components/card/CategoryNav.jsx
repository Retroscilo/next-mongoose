/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset
import { jsx, Spinner } from 'theme-ui'
import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react'

import propTypes from 'prop-types'
import { Switch, PrevArrow, OptionsList } from '../misc/index'
import { useViewport } from '../../lib/hooks/useViewport'

// hooks
import { useCard } from '../../lib/hooks/useCard'
import { ThemeProvider, useTheme } from '../../lib/hooks/useTheme'
import { motion, AnimateSharedLayout } from 'framer-motion'

function getTextWidth (text, font) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
}

const CategoryNav = ({ client, clientView, setCategory, selectedCategory, setLast }) => {
  const { card, categories } = useCard()
  const [ addingCat, setAddingCat ] = useState(false)

  const pulseRef = useRef(null)
  const { width } = useViewport()
  const mobile = width < 832
  const { theme } = useTheme(); const classicLayout = theme.layout === 'classic'
  const [ displayedCat, setDisplayedCat ] = useState([])
  const [ hiddenCat, setHiddenCat ] = useState([])

  useEffect(() => {
    // estimate (high) width of a category, adjust displayed categories
    const glyphAverageWidth = getTextWidth('s', theme.font.body.font)
    let cumulatedWidth = mobile ? 180 : 400
    const dc = [] // displayed cat
    const hc = [] // hidden cat
    card.catOrder.forEach(catId => {
      const category = categories.find(cat => cat._id === catId)
      cumulatedWidth += (category.catName.length * glyphAverageWidth) + 42
      if (cumulatedWidth > width || cumulatedWidth > 1180) hc.push(category)
      else dc.push(category)
    })
    setDisplayedCat(dc)
    setHiddenCat(hc)
  }, [ width, categories ])

  async function newCategory () {
    setAddingCat(true)
    await card.addCategory()
    setLast(true)
    setAddingCat(false)
    pulseRef.current.classList.add('pulse')
    setTimeout(() => pulseRef.current.classList.remove('pulse'), 300)
  }

  return (
    <div sx={{ bg: 'white', position: 'sticky', top: client ? 0 : '70px', width: '100%', zIndex: 1001, overflowX: 'auto', overflow: 'visible', ...theme.font.body, px: mobile ? 1 : 4 }}>
      <nav sx={{ display: 'grid', gridTemplateAreas: '"cat addCat"', alignItems: 'center', maxWidth: 'body', mx: 'auto' }}>
        <AnimateSharedLayout>
          <ul sx={{ gridArea: 'cat', justifySelf: 'start', display: 'flex', alignItems: 'center', justifyContent: classicLayout ? 'center' : '', overflow: 'visible', '& > *': { cursor: 'pointer' }, pl: 0 }}>
            {displayedCat.length > 0 && displayedCat.map(category => (
              <li
                key={category._id}
                sx={{ mr: 4, whiteSpace: 'nowrap', bottom: 0, transition: 'all .2s ease' }}
                className={category._id === selectedCategory ? 'isSelected' : ''}
              >
                {!classicLayout && <a href={`#${ category._id }`}>{category.catName}</a>}
                {classicLayout && <a onClick={() => setCategory(category._id)}>{category.catName}</a>}
                {category._id === selectedCategory && (
                  <motion.div
                    layoutId={'underline'}
                    sx={{ height: '5px', width: '100%', background: theme.colors.primary, position: 'absolute' }}
                    initial={false}
                    animate={{ borderColor: theme.colors.primary }}
                    transition={spring}
                  />
                )}
              </li>
            ))}
            <span
              ref={pulseRef}
              sx={{ borderRadius: '3px', position: 'relative', bottom: hiddenCat.map(hc => hc._id).includes(selectedCategory) ? '5px' : 0 }}
            >
              {hiddenCat.length > 0 &&
              <OptionsList
                label={displayedCat.length === 0 ? 'Catégories' : 'plus'}
                optionsList={hiddenCat}
                bold={hiddenCat.map(hc => hc._id).includes(selectedCategory)}
                options={{ position: displayedCat.length === 0 ? 'left' : 'right' }}
              >
                {hiddenCat.map(category => (
                  <li className={category._id === selectedCategory ? 'isSelected' : ''} sx={{ whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', width: 'fit-content' }} key={category._id}>
                    {!classicLayout && <a href={`#${ category._id }`}>{category.catName}</a>}
                    {classicLayout && <a onClick={() => setCategory(category._id)}>{category.catName}</a>}
                    {category._id === selectedCategory && (
                      <div sx={{ height: '5px', width: '100%', background: theme.colors.primary, position: 'absolute' }} />
                    )}
                  </li>
                ))}
              </OptionsList>}
              {hiddenCat.map(hc => hc._id).includes(selectedCategory) && (
                <motion.div
                  layoutId={'underline'}
                  sx={{ height: '5px', width: '100%', background: theme.colors.primary, position: 'absolute' }}
                  initial={false}
                  animate={{ borderColor: theme.colors.primary }}
                  transition={spring}
                />
              )}
            </span>
          </ul>
        </AnimateSharedLayout>
        {/* Add cat button */}
        {classicLayout && !clientView && !addingCat && <div sx={{ ...theme.button[mobile ? 'mobile' : 'desktop'], position: 'initial', gridArea: 'addCat', justifySelf: 'end', whiteSpace: 'nowrap', fontFamily: 'ubuntu', fontSize: 2 }} onClick={() => newCategory()}>{!mobile && 'ajouter une catégorie'}</div>}
        {/* & loading state */}
        {classicLayout && addingCat && <div sx={{ ...theme.button[mobile ? 'mobile' : 'desktop'], position: 'initial', gridArea: 'addCat', justifySelf: 'end', whiteSpace: 'nowrap', fontFamily: 'ubuntu', fontSize: 2, backgroundImage: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner color={'#fff'} size={25} /></div>}
      </nav>
      <style jsx>{`
        .isSelected {
          text-shadow: 1px 0px 0px black;
          position: relative
          bottom: 5px
        }
        .isSelected:hover {
          filter: brightness(1)
        }
        .underline {
          position: absolute
          height: 5px
          width: 100%
          background: ${ theme.colors.primary };
        }
        .pulse
          color: ${ theme?.colors?.highlight }
          animation pulse .6s

        @keyframes pulse
          0%
            box-shadow: 0 0 0pt 1pt rgba(228, 228, 228, 0)
          50%

          100%
            box-shadow: 0 0 0pt 1pt rgba(228, 228, 228, 0)
      `}</style>
    </div>
  )
}

export default CategoryNav

CategoryNav.propTypes = {
  categories: propTypes.array,
  client: propTypes.bool,
  setCategory: propTypes.func,
}

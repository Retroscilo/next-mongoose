/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

import { jsx, Spinner } from 'theme-ui'
import React, { useState, useRef, useEffect } from 'react'
import Category from './Category'
import propTypes from 'prop-types'
import { Switch, PrevArrow, OptionsList } from '../../components/misc/index'
import { useViewport } from '../../lib/hooks/useViewport'
import { AddCategory } from '../../components/card/addButtons'
import * as themes from './themes/index'
import { ThemeProvider, useTheme } from '../../lib/hooks/useTheme'
import { motion, animatedSharedLayout } from 'framer-motion'

const CategoryNav = ({ categories, client, setCategory, selectedCategory }) => {
  const { width } = useViewport()
  const mobile = width < 532
  const displayedCat = categories.filter((cat, i) => i < (mobile ? 2 : 3))
  const hiddenCat = categories.filter((cat, i) => i >= (mobile ? 2 : 3))
  const theme = useTheme(); const classicLayout = theme.layout === 'classic'

  return (
    <div sx={{ bg: 'white', position: 'sticky', top: client ? 0 : '70px', width: '100%', zIndex: 1000, overflowX: 'auto', overflow: 'visible', ...theme.font.body }}>
      <ul sx={{ display: 'flex', alignItems: 'center', justifyContent: classicLayout ? 'center' : '', mx: 'auto', maxWidth: 'body', px: 3, overflow: 'visible', '& > *': { cursor: 'pointer' } }}>
        {displayedCat.map(category => (
          <li
            key={category._id}
            sx={{ mr: 4 }}
            className={category._id === selectedCategory ? 'isSelected' : ''}
          >
            <a
              href={`#${ !classicLayout ? category._id : '' }`}
              onClick={() => setCategory(category._id)}
            >
              {category.catName}
            </a>
            <style jsx>{`
              .isSelected {
                font-weight: bold;
                position: relative
              }
              .isSelected::before {
                content: "";
                top: 25px
                width: 110%;
                left: -5%;
                height: 5px;
                background: ${ theme.colors.primary };
                position: absolute;
              }
            `}</style>
          </li>
        ))}
        {hiddenCat.length > 0 && <OptionsList label={'plus'} optionsList={hiddenCat}>
          {hiddenCat.map(category => (
            <li sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} key={category._id}>
              <a
                href={`#${ !classicLayout ? category._id : '' }`}
                onClick={() => setCategory(category._id)}
              >
                {category.catName}
              </a>
            </li>
          ))}
        </OptionsList>}
      </ul>
    </div>
  )
}

/**
 * Render the view of menu
 * @param {object} card structure of menu (categories & product)
 * @param {object} restaurant contain restaurant info (name/description/photo...)
 * @param {bool} client set true for restaurant's client render or false to activate the editor
 * @returns {void}
*/
const Menu = ({ card, restaurant, client, ...props }) => {
  const [ clientView, setClientView ] = useState(client)
  const [ categoryId, setCategory ] = useState(card.categories[0]._id)
  const theme = themes[card.theme] || themes.Qalme
  const { width } = useViewport()
  const mobile = width < 832

  return (
    <ThemeProvider theme={theme}>
      <div sx={{ width: '100%', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'url(/themes/Qalme/backgrounds/1.jpg) no-repeat', backgroundSize: 'cover' }}>
        {/* Card Header (restaurant infos) */}
        <div sx={{ width: '100%', bg: 'white' }}>
          <div sx={{ maxWidth: 'body', pl: 3, m: '0 auto' }}>
            <div sx={{ display: 'flex', alignItems: 'center', mt: 3, '& > *': { mr: 4 } }}>
              {!client &&
              <>
                <PrevArrow />
                <Switch
                  isOn={clientView}
                  label={'Vue client'}
                  onClick={() => setClientView(!clientView)}
                />
              </>}
            </div>
            <h1 sx={{ ...theme.font.restaurant, textAlign: 'center' }}>{restaurant.restaurantName}</h1>
            <p sx={{ ...theme.font.body, maxWidth: '80%', mx: 'auto', textAlign: 'center' }}>{restaurant.restaurantDescription}</p>
          </div>
        </div>
        {/* Category navigation */}
        <CategoryNav categories={card.categories} client={client} setCategory={setCategory} selectedCategory={categoryId} />
        {/* Card body */}
        {card.categories.map(category => (
          theme.layout === 'classic' && category._id === categoryId && <Category
            client={clientView}
            key={category._id}
            cardId={card._id}
            structure={category}
            refresh={props.updateCard}
          />
        ))}
        {!clientView && <AddCategory onClick={() => props.addCategory()}>Ajouter une catégorie </AddCategory>}
      </div>
    </ThemeProvider>
  )
}

export default Menu

Menu.propTypes = {
  addCategory: propTypes.func,
  card: propTypes.object,
  client: propTypes.bool,
  restaurant: propTypes.object,
  updateCard: propTypes.func,
}

CategoryNav.propTypes = {
  categories: propTypes.array,
  client: propTypes.bool,
  setCategory: propTypes.func,
}

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
import CategoryNav from './CategoryNav'
import ThemeCustomizer from './ThemeCustomizer'

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
  const resetCategory = () => setCategory(card.categories[0]._id)
  const [ test, settest ] = useState(false)

  const addCategory = async () => {
    await props.addCategory()
    settest(true)
  }

  const theme = themes[card.theme] || themes.Qalme
  const { width } = useViewport()
  const mobile = width < 832

  return (
    <ThemeProvider theme={theme}>
      <div sx={{ width: '100%', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: `url(/themes/${card.theme.name}/backgrounds/${card.theme.background || theme.backgrounds[0]}.jpg) no-repeat`, backgroundSize: 'cover', pb: clientView ? 5 : 6 }}>
        {/* Card Header (restaurant infos) */}
        <div sx={{ width: '100%', bg: 'white' }}>
          <div sx={{ maxWidth: 'body', pl: mobile ? 1 : 4, m: '0 auto' }}>
            <div sx={{ display: 'flex', alignItems: 'center', mt: 3, '& > *': { mr: 4 } }}>
              {!client &&
              <>
                <PrevArrow />
                <ThemeCustomizer cardId={card._id} theme={card.theme} updateCard={props.updateCard} />
                <Switch
                  isOn={clientView}
                  label={'Vue client'}
                  onClick={() => setClientView(!clientView)}
                  size={35}
                />
              </>}
            </div>
            <h1 sx={{ ...theme.font.restaurant, textAlign: 'center' }}>{restaurant.restaurantName}</h1>
            <p sx={{ ...theme.font.body, maxWidth: '80%', mx: 'auto', textAlign: 'center' }}>{restaurant.restaurantDescription}</p>
          </div>
        </div>
        {/* Category navigation */}
        <CategoryNav categories={card.categories} client={client} clientView={clientView} setCategory={setCategory} selectedCategory={categoryId} addCategory={addCategory} />
        {/* Card body */}
        {card.categories.map(category => (
          theme.layout === 'classic' && category._id === categoryId && <Category
            client={clientView}
            key={category._id}
            cardId={card._id}
            structure={category}
            refresh={props.updateCard}
            resetCategory={resetCategory}
          />
        ))}
        {!clientView && theme.layout !== 'classic' && <AddCategory onClick={() => props.addCategory()}>Ajouter une catégorie </AddCategory>}
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

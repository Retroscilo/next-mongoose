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
import { useCard } from '../../lib/hooks/useCard'
import { AddCategory } from '../../components/card/addButtons'
import * as themes from './themes/index'
import { ThemeProvider } from '../../lib/hooks/useTheme'
import CategoryNav from './CategoryNav'
import ThemeCustomizer from './ThemeCustomizer'

/**
 * Render the view of menu
 * @param {object} card structure of menu (categories & product)
 * @param {object} restaurant contain restaurant info (name/description/photo...)
 * @param {bool} client set true for restaurant's client render or false to activate the editor != clientView prop
 * @returns {void}
*/
const Menu = ({ restaurant, client }) => {
  const { card, categories } = useCard()
  const [ clientView, setClientView ] = useState(client) // client PREVIEW != client VIEW
  const [ categoryId, setCategory ] = useState(categories[0]._id) // displayed category
  const resetCategory = () => setCategory(categories[0]._id)

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
                <ThemeCustomizer />
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
        <CategoryNav client={client} clientView={clientView} setCategory={setCategory} selectedCategory={categoryId} />
        {/* Card body */}
        {categories.map(category => (
          theme.layout === 'classic' && category._id === categoryId &&
          <Category
            client={clientView}
            key={category._id}
            catId={category._id}
            resetCategory={resetCategory}
          />
        ))}
        {!clientView && theme.layout !== 'classic' && <AddCategory onClick={card.addCategory}>Ajouter une catégorie </AddCategory>}
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

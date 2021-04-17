/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

import { jsx, Spinner } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'
import Category from '../../components/card/Category'
import propTypes from 'prop-types'
import { Switch, PrevArrow, OptionsList } from '../../components/misc/index'
import { useViewport } from '../../lib/hooks/useViewport'
import { AddCategory } from '../../components/card/addButtons'

const CategoryNav = ({ categories, client }) => {
  const { width } = useViewport()
  const mobile = width < 532
  const displayedCat = categories.filter((cat, i) => i < (mobile ? 2 : 3))
  const hiddenCat = categories.filter((cat, i) => i >= (mobile ? 2 : 3))
  return (
    <div sx={{ bg: 'white', position: 'sticky', top: client ? 0 : '70px', width: '100%', zIndex: 1000, overflowX: 'auto', overflow: 'visible' }}>
      <ul sx={{ display: 'flex', alignItems: 'center', mx: 'auto', maxWidth: 'body', px: 3, overflow: 'visible', '& > *': { color: 'primary', cursor: 'pointer' } }}>
        {displayedCat.map(category => (
          <li key={category._id} sx={{ mr: 4 }} ><a href={`#${ category._id }`}>{category.catName}</a></li>
        ))}
        {hiddenCat.length > 0 && <OptionsList label={'plus'} optionsList={hiddenCat}>
          {hiddenCat.map(category => (
            <li sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }} key={category._id}><a href={`#${ category._id }`}>{category.catName}</a></li>
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
  const { width } = useViewport()
  const mobile = width < 832

  return (
    /* Card Header (restaurant infos) */
    <div sx={{ width: '100%', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div sx={{ width: '100%', bg: 'white' }}>
        <div sx={{ maxWidth: 'body', pl: 3, m: '0 auto' }}>
          <div sx={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: mobile ? 'column' : 'row' }}>
            <span sx={{ display: 'flex', alignItems: 'center' }}>
              {!client && <PrevArrow />}
              <h1>{restaurant.restaurantName}</h1>
            </span>
            {!client &&
              <Switch
                isOn={clientView}
                label={'Vue client'}
                onClick={() => setClientView(!clientView)}
              />}
          </div>
          <p>{restaurant.restaurantDescription}</p>
        </div>
      </div>
      {/* Category navigation */}
      <CategoryNav categories={card.categories} client={client} />
      {/* Card body */}
      {card.categories.map(category => (
        <Category
          client={clientView}
          key={category._id}
          cardId={card._id}
          structure={category}
          refresh={props.updateCard}
        />
      ))}
      {!clientView && <AddCategory onClick={() => props.addCategory()}>Ajouter une catégorie </AddCategory>}
    </div>
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

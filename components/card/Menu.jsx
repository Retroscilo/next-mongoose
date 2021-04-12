/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

import { jsx, Spinner } from 'theme-ui'
import { useState, useRef, useEffect } from 'react'
import Category from '../../components/card/Category'
import propTypes from 'prop-types'
import { Switch, PrevArrow } from '../../components/misc/index'

/**
 * Render the view of menu
 * @param {object} card structure of menu (categories & product)
 * @param {object} restaurant contain restaurant info (name/description/photo...)
 * @param {bool} client set true for restaurant's client render or false to activate the editor
 * @returns {void}
*/
const Menu = ({ card, restaurant, client, ...props }) => {
  const [ clientView, setClientView ] = useState(client)
  const catList = useRef(null)
  const [ wrapping, setWrapping ] = useState(false)

  return (
    /* Card Header (restaurant infos) */
    <div sx={{ width: '100%', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div sx={{ width: '100%', bg: 'white' }}>
        <div sx={{ maxWidth: 'body', pl: [ 2, 3 ], m: '0 auto' }}>
          <div sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      <div sx={{ bg: 'white', position: 'sticky', top: '70px', width: '100%', zIndex: 60 }}>
        <ul ref={catList} sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', maxWidth: 'body', mx: 'auto', px: 3, height: '20px' }}>
          {card.categories.map(category => (
            <li key={category._id}><a href={`#${ category._id }`}>{category.catName}</a></li>
          ))}
        </ul>
      </div>
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
      {!clientView && <div sx={{ variant: 'Add.category' }} onClick={props.addCategory}>Ajouter une catégorie </div>}
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

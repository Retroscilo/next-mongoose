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
import Product from './product/index'
// Dnd
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

/**
 * Render the view of menu
 * @param {object} card structure of menu (categories & product)
 * @param {object} restaurant contain restaurant info (name/description/photo...)
 * @param {bool} client set true for restaurant's client render or false to activate the editor != clientView prop
 * @returns {void}
*/
const Menu = ({ restaurant, client }) => {
  const { card, categories, updateCard } = useCard()
  const [ clientView, setClientView ] = useState(client) // client PREVIEW != client VIEW
  const [ categoryId, setCategory ] = useState(categories[0]?._id) // displayed category
  const [ last, setLast ] = useState(false) // set to the newest category when created
  const [ second, setSecond ] = useState(false) // set to the second category when the first is deleted
  useEffect(() => {
    if (last) {
      setLast(false)
      setCategory(categories[categories.length - 1]._id)
    }
    if (second) {
      console.log(second)
      setSecond(false)
      setCategory(categories[1]?._id)
    }
  })

  const resetCategory = () => {
    setCategory(categories[0]?._id)
  }

  const theme = themes[card.theme] || themes.Qalme
  const { width } = useViewport()
  const mobile = width < 832

  // Dnd Logic
  const [ items, setItems ] = useState(categories.find(cat => cat._id === categoryId).prodOrder)
  useEffect(() => {
    setItems(categories.find(cat => cat._id === categoryId).prodOrder)

  }, [card])
  const [ activeId, setActiveId ] = useState(null)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

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
            <CategoryNav client={client} clientView={clientView} setCategory={setCategory} selectedCategory={categoryId} setLast={setLast} />
            {/* Card body */}
            <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
            {card.categories.length === 0 && <div sx={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Ajouter une catégorie pour commencer à éditer votre carte !</div>}
            {categories.length > 0 && card.catOrder.map(catId => (
              theme.layout === 'classic' && catId === categoryId &&
              <Category
                client={clientView}
                key={catId}
                catId={catId}
                items={items}
                setCategory={setCategory}
              />
            ))}
                    <DragOverlay>
          <div sx={{ height: '50px', width: '50px' }} />
        </DragOverlay>
      </SortableContext>
    </DndContext>
            {!clientView && theme.layout !== 'classic' && <AddCategory onClick={card.addCategory}>Ajouter une catégorie </AddCategory>}
            <div sx={{ width: '100px', height: '100px', bg: 'crimson' }} onClick={() => window.scrollBy(0, -100)}></div>
          </div>
        </ThemeProvider>

  )

  // DnD logic
  function handleDragStart(event) {
    console.log('start')
    setActiveId(event.active.id)
  }

  function handleDragEnd(event) {
    const {active, over} = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  function handleDragCancel() {
    setActiveId(null)
  }
}

export default Menu

Menu.propTypes = {
  addCategory: propTypes.func,
  card: propTypes.object,
  client: propTypes.bool,
  restaurant: propTypes.object,
  updateCard: propTypes.func,
}

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useEffect, useState, useRef } from 'react'
import Card from './Card'
import Tabs from './Tabs/Tabs'
import { useRestaurants } from '../../lib/hooks/useRestaurants'
import Button from '../misc/Button'
import Input from './Input/Input'
import Tooltip from '../misc/Tooltip'
import Link from 'next/link'

const CardsCard = ({ activeRestaurantId }) => {
  const { useRestaurant } = useRestaurants()
  // Gather restaurant's informations (object & page's active id) from context & page's state
  const [ restaurant, setRestaurant ] = useState(useRestaurant(activeRestaurantId))
  useEffect(() => setRestaurant(useRestaurant(activeRestaurantId)), [ activeRestaurantId ])
  // Set card's object
  const [ active, setActive ] = useState(restaurant.cards[0]?.cardId)
  const [ card, setCard ] = useState(restaurant.useCard(active))
  useEffect(() => setCard(restaurant.useCard(active)), [ active ])

  const [ last, setLast ] = useState(false)
  const handleAdd = () => {
    restaurant.addCard()
    setLast(true)
  }

  return (
    <Card>
      <Card.Title color="body">Cartes</Card.Title>
      {restaurant.cards.length === 0 ?
        <span sx={{ px: 2 }}>
          <h1>Vous n'avez pas de cartes !</h1>
          <Button onClick={restaurant.addCard}>Ajouter une carte</Button>
        </span>
        :
        <>
          <Tabs defaultSelection={active} onSelection={setActive}>
            {restaurant.cards.map(c => (
              <Tabs.Item key={c.cardId} id={c.cardId}>{c.name}</Tabs.Item>
            ))}
            <Tooltip tip={'ajouter une carte'} >
              <Tabs.Action onClick={handleAdd} />
            </Tooltip>
          </Tabs>
          <div sx={{ py: 2, px: 4 }}>
            <Input>{card.name}</Input>
            <Button variant="primary" >
              <Link href={`/cards/${card.cardId}`} >
                <a>Modifier</a>
              </Link>
              <Button.Arrow />
            </Button>
            <Button>Définir comme carte active</Button>
            <Button color={'crimson'}>Supprimer</Button>
          </div>
        </>}
    </Card>
  )
}

export default CardsCard

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import useUser from '../../lib/hooks/useUser'
import useRestaurant from '../../lib/hooks/useRestaurant'
import fetchJson from '../../lib/fetchJson'
import useSwr, { mutate } from 'swr'
import React, { useState, useEffect } from 'react'
import Card from '../../components/Card'
import Modal from '../../components/Modal'

const ModalForm = ({ display, id, handleClose, update }) => {
  const { user, mutateUser } = useUser()
  const handleSubmit = async e => {
    e.preventDefault()
    const req = {
      name: e.currentTarget.name.value,
      restaurantId: id,
    }
    //! Immediate revalidation to implement
    // Post new card to DB
    await update(req)
    handleClose()
  }
  if (!display) return null
  return (
    <div className="modal" sx={{ width: '100vw', height: '100vh', bg: 'rgba(196, 196, 196, 0.5)', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', top: '0' }}>
      <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
        <input type="text" name="name" required />
        <textarea name="description" id="" cols="30" rows="10" />
        <button
          type="submit"
        >Créer ma nouvelle carte</button>
      </form>
    </div>
  )
}

const Cards = () => {
  const { user, mutateUser } = useUser({
    redirectTo: '/login',
    redirectIfFound: false,
  })
  const { restaurants, updateRestaurants } = useRestaurant()
  const [ restaurantId, setRestaurantId ] = useState(null)
  const [ activeCard, setActiveCard ] = useState(null)
  useEffect(() => {
    if (restaurants) {
      setRestaurantId(restaurants[0]._id)
      setActiveCard(restaurants[0].activeCard)
    }
  }, [ restaurants ])

  // new card modal
  const [ modal, setModal ] = useState(false)
  // gather cards
  const { data: cards } = useSwr('/api/cards')
  // update component when adding or deleting Cards
  const update = () => mutateUser('/api/user')

  return (
    <>
      <ul sx={{ display: 'flex', width: '100%' }}>
        {restaurants && restaurants.map(restaurant => <li key={restaurant._id}>{restaurant.restaurantName}</li>)}
      </ul>
      <div sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', maxWidth: '800px', mx: 'auto', my: 3, gridGap: 2, justifyItems: 'center', alignItems: 'center' }}>
        {!cards && <h1>Loading</h1>}
        {restaurants && restaurants.find(restaurant => restaurant._id === restaurantId)?.cards.map(card => (
          <Card
            key={card.cardId}
            id={card.cardId}
            name={card.name}
            update={update}
            active={card.cardId === activeCard}
          />
        ))}
        <ModalForm display={modal} handleClose={setModal} id={restaurantId} update={updateRestaurants} />
        {/* <Modal>
          {() => (<div sx={{ bg: 'white', width: '100px', height: '100px' }}>ezfzef</div>)}
        </Modal> */}
        <Button onClick={setModal}>
          Ajouter une carte
        </Button>
      </div>
    </>
  )
}

export default Cards

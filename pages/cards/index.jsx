/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import useUser from '../../lib/useUser'
import fetchJson from '../../lib/fetchJson'
import useSwr, { mutate } from 'swr'
import { useState } from 'react'
import Card from '../../components/Card'
import Modal from '../../components/Modal'

const ModalForm = ({ display, onSubmit, handleClose }) => {
  const handleSubmit = async e => {
    e.preventDefault()
    const body = {
      name: e.currentTarget.name.value,
      description: e.currentTarget.description.value,
    }
    //! Immediate revalidation to implement
    // Post new card to DB
    await fetchJson('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    // Re-validate data (swr)
    mutate('/api/cards')

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
  useUser({
    redirectTo: '/login',
    redirectIfFound: false,
  })

  // new card modal
  const [ modal, setModal ] = useState(false)
  // gather cards
  const { data: cards } = useSwr('/api/cards')
  // update component when adding or deleting Cards
  const update = () => mutate('/api/cards')

  return (
    <div sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', maxWidth: '800px', mx: 'auto', my: 3, gridGap: 2, justifyItems: 'center', alignItems: 'center' }}>
      {!cards && <h1>Loading</h1>}
      {cards && cards.map((card, i) => (
        <Card
          key={i}
          id={card._id}
          name={card.name}
          description={card.description}
          update={update}
        />
      ))}
      <ModalForm display={modal} handleClose={setModal} />
      {/* <Modal>
        {() => (<div sx={{ bg: 'white', width: '100px', height: '100px' }}>ezfzef</div>)}
      </Modal> */}
      <Button onClick={setModal}>
        Ajouter une carte
      </Button>
    </div>
  )
}

export default Cards

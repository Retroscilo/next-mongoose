/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Input from '../Input'
import { useState } from 'react'
import fetchJson from '../../lib/fetchJson'


const RestaurantCard = ({ restaurant, mutate }) => {
  const [ confirmDelete, setConfirmDelete ] = useState(false)

  async function modifyRestaurant (restaurantId, body) {
    try {
      await fetchJson(`/api/restaurant/${ restaurantId }`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (err) {
      console.log('err')
    }
    mutate()
  }

  async function deleteRestaurant (restaurantId) {
    await fetchJson(`/api/restaurant/${ restaurantId }`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    })
    mutate()
  }

  return (
    <div key={restaurant._id} sx={{ bg: 'white', p: 3, pb: 3, px: 3, maxWidth: '30rem', my: 3, '& > *:not(:first-of-type)': { mt: 4 } }}>
      <div className="Account--input">
        Nom :
        <Input
          defaultValue={restaurant.restaurantName}
          field={'restaurantName'}
          update={(field, newValue) => modifyRestaurant(restaurant._id, { field, newValue })}
          options={{
            empty: {
              prevent: true,
              err: 'Vous devez nommer votre restaurant !',
            },
            max: 30,
            after: 'url(/editAlt.svg)',
          }}
        />
      </div>
      <div className="Account--input">
        Description :
        <Input
          defaultValue={restaurant.restaurantDescription || 'Ajouter une description'}
          variant={!restaurant.restaurantDescription ? 'light' : ''}
          field={'restaurantDescription'}
          update={(field, newValue) => modifyRestaurant(restaurant._id, { field, newValue })}
          options={{ max: 200, after: 'url(/editAlt.svg)', width: '300px', maxHeight: '95px' }}
        />
      </div>
      <div className="Account--input">
        Adresse :
        <Input
          defaultValue={restaurant.location || 'Ajouter une adresse'}
          variant={!restaurant.location ? 'light' : ''}
          field={'location'}
          update={(field, newValue) => modifyRestaurant(restaurant._id, { field, newValue })}
          options={{ max: 50, after: 'url(/editAlt.svg)' }}
        />
      </div>
      {!confirmDelete &&
      <div
        sx={{ color: 'crimson', cursor: 'pointer' }}
        onClick={() => setConfirmDelete(restaurant._id)}
      >Supprimer ce restaurant</div>}
      {confirmDelete === restaurant._id &&
      <div sx={{ color: 'crimson' }}>
        Êtes-vous sûr ? Toutes les cartes seront également supprimées.
        <span sx={{ display: 'flex', maxWidth: '15rem', mx: 'auto', mt: 3, justifyContent: 'space-between', alignItems:'center' }}>
          <div sx={{ variant: 'Button.primary' }} onClick={() => setConfirmDelete(false)}>Annuler</div>
          <div sx={{ cursor: 'pointer' }} onClick={() => { deleteRestaurant(restaurant._id); setConfirmDelete(false) }}>Confirmer</div>
        </span>
      </div>}
      <style jsx>{`
        .Account--input {
          display: grid; 
          grid-template-columns: 150px 1fr;
        }
      `}</style>
    </div>
  )
}

export default RestaurantCard

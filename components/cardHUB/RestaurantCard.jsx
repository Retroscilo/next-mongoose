/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useEffect, useState } from 'react'
import Card from './Card'
import Tabs from './Tabs'
import { useRestaurants } from '../../lib/hooks/useRestaurants'
import fetchJson from '../../lib/fetchJson'
import Button from '../misc/Button'
import Input from '../Input'

const RestaurantCard = () => {
  const { restaurants } = useRestaurants()
  const [ active, setActive ] = useState(restaurants[0])
  const [ reset, setReset ] = useState(false)

  const handleRemove = () => {
    restaurants.remove(active._id)
    setReset(true)
  }

  useEffect(() => {
    if (!reset) return
    setActive(restaurants[0])
    setReset(false)
  }, [ restaurants ])

  return (
    <Card>
      <h1 sx={{ position: 'absolute', color: 'white', top: '-70px', fontWeight: 'normal' }}>Restaurants</h1>
      <Tabs active={active} items={restaurants} setItem={setActive} action={restaurants.add} activeAction={!(restaurants.length > 2)} />
      <div sx={{ px: 4, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
        <span>
          <h1 sx={{ fontWeight: 'normal' }}>{active.restaurantName}</h1>
          {active.restaurantDescription &&
          <Input
            client={false}
            defaultValue={active.restaurantDescription}
            // update={product.update}
            variant="body"
            field={'prodDescription'}
            options={{ max: 140, gridArea: 'prodDescription', maxHeight: '95px', maxWidth: '95%' }}
          />
          }
          {!active.restaurantDescription && <Button>Ajouter une description</Button>}
          {!active.adress && <Button>Ajouter une adresse</Button>}
        </span>
        <span sx={{ display: 'inline-flex', justifyContent: 'space-between', width: 'fit-content', minWidth: '300px' }}>
          <Button>ajouter une photo</Button>
          <Button color={'crimson'} onClick={handleRemove} >supprimer</Button>
        </span>
      </div>
    </Card>
  )
}

export default RestaurantCard

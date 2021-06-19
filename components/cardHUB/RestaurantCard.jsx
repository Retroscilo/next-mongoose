/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useEffect, useState, useRef } from 'react'
import Card from './Card'
import Tabs from './Tabs/Tabs'
import { useRestaurants } from '../../lib/hooks/useRestaurants'
import Button from '../misc/Button'
import Input from './Input/Input'
import Tooltip from '../misc/Tooltip'
import { FileInput } from '../FileInput'

const RestaurantCard = ({ setActiveRestaurantId }) => {
  const { restaurants, useRestaurant } = useRestaurants()

  const [ active, setActive ] = useState(restaurants[0]._id)
  const [ restaurant, setRestaurant ] = useState(useRestaurant(active))

  useEffect(() => {
    setRestaurant(useRestaurant(active))
    setActiveRestaurantId(active) // context state
  }, [ active ])

  const [ reset, setReset ] = useState(false)
  const [ last, setLast ] = useState(false)

  useEffect(() => {
    if (last) {
      setActive(restaurants[restaurants.length - 1]._id)
      setLast(false)
    }
    if (!reset) return
    setActive(restaurants[0]._id)
    setReset(false)
  }, [ restaurants ])

  const handleRemove = () => {
    restaurant.remove()
    setReset(true)
  }

  const handleAdd = () => {
    restaurants.add()
    setLast(true)
  }

  const FileInputRef = useRef(null)

  const handlePhotoUpload = e => {
    console.log(FileInputRef.current.files)
  }

  return (
    <Card>
      <Card.Title>Restaurants</Card.Title>
      <Tabs defaultSelection={active} onSelection={setActive}>
        {restaurants.map(r => (
          <Tabs.Item key={r._id} id={r._id}>{r.restaurantName}</Tabs.Item>
        ))}
        <Tooltip tip={'ajouter un restaurant'} >
          <Tabs.Action onClick={handleAdd} />
        </Tooltip>
      </Tabs>
      <div sx={{ px: 4, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: 'calc(100% - 60px)', py: 3 }}>
        <Input
          maxChar={30}
          modifiers={[ 'preventChariot', 'empty' ]}
          callback={restaurant.changeName}
          ariaLabel="Nom du restaurant"
          size="L"
        >
          {restaurant.restaurantName}
        </Input>
        {restaurant.restaurantDescription ?
          <Input
            // update={product.update}
            variant="body"
            field={'prodDescription'}
            options={{ max: 140, gridArea: 'prodDescription', maxHeight: '95px', maxWidth: '95%' }}
          >
            {restaurant.restaurantDescription}
          </Input>
          :
          <Button onClick={() => restaurant.changeDescription('Description du restaurant')}>Ajouter une description</Button>
        }
        {!restaurant.adress && <Button>Ajouter une adresse</Button>}
        <span sx={{ display: 'inline-flex', justifyContent: 'space-between', width: 'fit-content', minWidth: '300px' }}>
          <Button onClick={() => FileInputRef.current.click()} >ajouter une photo</Button>
          <Button color={'crimson'} onClick={handleRemove}>supprimer</Button>
        </span>
      </div>
      <FileInput onChange={handlePhotoUpload} ref={FileInputRef} />
    </Card>
  )
}

export default RestaurantCard

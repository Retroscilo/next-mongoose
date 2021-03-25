/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner} from 'theme-ui'
import theme from '../theme'
import React, { useEffect, useState } from 'react'
import useUser from '../lib/hooks/useUser'
import Input from '../components/Input'
import withSession from '../lib/session'
import connect from '../lib/middlewares/mongodb'
import User from '../lib/models/user.model'
import Restaurant from '../lib/models/restaurant.model'
import fetchJSON from '../lib/fetchJson'
import useSWR from 'swr'

const OptionCard = ({title, children, subtitle}) => (
  <>
    <div sx={{ bg: 'white', p: 3, pb: 3, px: 3, maxWidth: '30rem', my: 3, '& > *:not(:first-of-type)': { mt: 4 } }}>{children}</div>
  </>
)

const Account = ({ SSRrestaurants }) => {
  const { user } = useUser()
  const [ restaurants, setRestaurants ] = useState(SSRrestaurants)
  const { data: freshRestaurants, mutate } = useSWR('/api/restaurant')
  useEffect(() => freshRestaurants && setRestaurants(freshRestaurants), [ freshRestaurants ])
  console.log(restaurants)
  async function addRestaurant () {
    await fetchJSON('/api/restaurant', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    })
    mutate()
  }

  async function modifyRestaurant (restaurantId, body) {
    console.log('reached')
    await fetchJSON(`/api/restaurant/${ restaurantId }`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    mutate()
  }

  async function deleteRestaurant (restaurantId) {
    await fetchJSON(`/api/restaurant/${ restaurantId }`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    })
    mutate()
  }

  return (
    <div
      sx={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
      }}
    >
      <nav
        sx={{
          bg: 'white',
          borderRight: '1px solid lightgrey',
          p: 0,
          m: 0,
        }}
      >
        <ul>
          <li>
            Général
            <ul sx={{ variant: 'text.light', pl: 3, mt: 3, '& > li': { mt: 2 }, '& > li:last-child': { mb: 2 } }}>
              <li>Utilisateur</li>
              <li>Restaurants</li>
              <li>QR Code</li>
            </ul>
          </li>
          <li>Abonnements</li>
        </ul>
      </nav>
      {!user && <Spinner />}
      {user && <section sx={{ px: 3, height: 'min', overflow: 'auto' }}>
        <h1>Général</h1>
        <h2 sx={{ variant: 'text.body', fontSize: 3, fontWeight: 'normal' }}>Utilisateur</h2>
        <OptionCard title={'Utilisateur'}>
          <div className="Account--input">
            Email :
            <Input
              defaultValue={user.email}
              variant={'bold'}
              options={{
                max: 40,
                empty: {
                  prevent: true,
                  err: 'Vous devez entrez votre email !',
                },
                validator: {
                  match: value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value),
                  err: 'Verifiez votre adresse mail !',
                },
                after: 'url(/editAlt.svg)',
              }}
            />
          </div>
          <div>Changer mon mot de passe</div>
          <div sx={{ color: 'crimson' }}>Supprimer mon compte</div>
        </OptionCard>
        <h2 sx={{ variant: 'text.body', fontSize: 3, fontWeight: 'normal' }}>Restaurants</h2>
        <h3 sx={{ variant: 'text.light', fontSize: 2, fontWeight: 'normal' }} >Ces informations s'afficheront sur votre carte</h3>
        {(user && restaurants.length === 0) &&
          <div>Vous n'avez pas encore de restaurants</div>
        }
        {user && restaurants.map(restaurant => (
          <OptionCard
            key={restaurant._id}
            title={'Restaurants'}
            subtitle={"Ces informations s'afficheront sur votre carte"}
          >
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
                options={{ max: 50, after: 'url(/editAlt.svg)' }}
              />
            </div>
            <div className="Account--input">
              Adresse :
              <Input
                defaultValue={restaurant.location || 'Ajouter une adresse'}
                variant={!restaurant.location ? 'light' : ''}
                options={{ max: 50, after: 'url(/editAlt.svg)' }}
              />
            </div>
            <div
              sx={{ color: 'crimson' }}
              onClick={() => deleteRestaurant(restaurant._id)}
            >Supprimer ce restaurant</div>
          </OptionCard>
        ))}
        {(user && restaurants.length < 3) &&
          <div sx={{ width: '30rem', my: 3 }}>
            <div sx={{ variant: 'Button.primary', mx: 'auto' }}onClick={addRestaurant}>Ajouter un restaurant</div>
          </div>
        }
        <h1>QR codes</h1>
      </section>}
      <style jsx>{`
        .Account--input {
          display: grid; 
          grid-template-columns: 150px 1fr;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps = connect(withSession(async ({ req, res }) => {
  const session = req.session.get('user')
  const user = await User.findById(session.userId)
  const restaurants = await Restaurant.find({ _id: { $in: user.restaurants } })

  return {
    props: { SSRrestaurants: JSON.parse(JSON.stringify(restaurants)) },
  }
}))

export default Account

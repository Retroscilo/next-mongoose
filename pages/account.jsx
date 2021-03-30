/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import { jsx, Spinner } from 'theme-ui'
import theme from '../theme'
import React, { useEffect, useState } from 'react'
// Components
import RestaurantCard from '../components/options/RestaurantCard'
import UserCard from '../components/options/UserCard'
import Input from '../components/Input'
// lib
import fetchJson from '../lib/fetchJson'
import useSWR from 'swr'
import useUser from '../lib/hooks/useUser'
// SSR
import withSession from '../lib/session'
import connect from '../lib/middlewares/mongodb'
import User from '../lib/models/user.model'
import Restaurant from '../lib/models/restaurant.model'

const Account = ({ SSRrestaurants }) => {
  const { user, mutateUser } = useUser({ redirectTo: '/login', redirectIfFound: false })
  const [ restaurants, setRestaurants ] = useState(SSRrestaurants)
  const { data: freshRestaurants, mutate } = useSWR('/api/restaurant')
  useEffect(() => freshRestaurants && setRestaurants(freshRestaurants), [ freshRestaurants ])
  console.log(user)

  async function addRestaurant () {
    await fetchJson('/api/restaurant', {
      method: 'POST',
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

      {/** ----------------------------------------------------- USER ------------------------------------------------------------ */}
      {!user && <Spinner />}
      {user && <section sx={{ px: 3, height: 'min', overflow: 'auto' }}>
        <h1>Général</h1>
        <h2 sx={{ variant: 'text.body', fontSize: 3, fontWeight: 'normal' }}>Utilisateur</h2>
        <UserCard user={user} mutateUser={mutateUser} />

        {/** ----------------------------------------------------- RESTAURANT ------------------------------------------------------------ */}
        <h2 sx={{ variant: 'text.body', fontSize: 3, fontWeight: 'normal' }}>Restaurants</h2>
        <h3 sx={{ variant: 'text.light', fontSize: 2, fontWeight: 'normal' }} >Ces informations s'afficheront sur votre carte</h3>
        {(user && restaurants.length === 0) &&
          <div>Vous n'avez pas encore de restaurants</div>
        }
        {user && restaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            mutate={mutate}
          />
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

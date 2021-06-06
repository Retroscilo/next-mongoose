/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import { jsx, Spinner } from 'theme-ui'
import React, { useEffect, useState } from 'react'
// Components
import RestaurantCard from '../components/options/RestaurantCard'
import UserCard from '../components/options/UserCard'
// lib
import fetchJson from '../lib/fetchJson'
import useSWR from 'swr'
import useUser from '../lib/hooks/useUser'
// SSR
import withSession from '../lib/session'
import connect from '../lib/middlewares/mongodb'
import User from '../lib/models/user.model'
import Restaurant from '../lib/models/restaurant.model'
import { useViewport } from '../lib/hooks/useViewport'

const Account = ({ SSRrestaurants }) => {
  const { width } = useViewport()
  const mobile = width < 832
  const { user, mutateUser } = useUser({ redirectTo: '/login', redirectIfFound: false })
  const [ restaurants, setRestaurants ] = useState(SSRrestaurants)
  const { data: freshRestaurants, mutate } = useSWR('/api/restaurant')
  useEffect(() => freshRestaurants && setRestaurants(freshRestaurants), [ freshRestaurants ])

  async function addRestaurant () {
    await fetchJson('/api/restaurant', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    })
    mutate()
  }

  return (
    <div>
      {!mobile && <nav
        sx={{
          width: '250px',
          bg: 'white',
          borderRight: '1px solid lightgrey',
          p: 0,
          m: 0,
          overflow: 'hidden',
          height: 'calc(100vh - 70px)',
          position: 'fixed',
          top: '70px',
          zIndex: -1,
        }}
      >
        <ul>
          <li>
            Général
            <ul sx={{ variant: 'text.light', pl: 3, mt: 3, '& > li': { mt: 2 }, '& > li:last-child': { mb: 3 } }}>
              <li>Utilisateur</li>
              <li>Restaurants</li>
            </ul>
          </li>
          <li>Abonnements</li>
          <ul sx={{ variant: 'text.light', pl: 3, mt: 3, '& > li': { mt: 2 }, '& > li:last-child': { mb: 3 } }}>
            <li>Bientôt !</li>
          </ul>
        </ul>
      </nav>}

      {!user && <Spinner />}
      {user && <section sx={{ px: 3, overflow: 'auto', ml: mobile ? 0 : '250px' }}>
        <h1>Général</h1>
        {/** USER ------------------------------------------------------------ */}
        <h2
          sx={{
            variant: 'text.body',
            fontSize: 3,
            fontWeight: 'normal',
            position: 'relative',
            '&::after': {
              fontSize: 2,
              content: user.verified ? '"Verifié"' : '"Non vérifié"',
              position: 'absolute',
              left: '120px',
              top: '-10%',
              border: '2px solid',
              color: user.verified ? 'primary' : 'crimson',
              borderColor: user.verified ? 'primary' : 'crimson',
              borderRadius: '3px',
              px: 2,
              py: 1,
            },
          }}
        >Utilisateur</h2>
        <UserCard user={user} mutateUser={mutateUser} />

        {/** RESTAURANT ------------------------------------------------------------ */}
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
          <div sx={{ width: '100%m', maxWidth: '30rem', my: 3 }}>
            <div sx={{ variant: 'Button.primary', mx: 'auto' }} onClick={addRestaurant}>Ajouter un restaurant</div>
          </div>
        }
      </section>}
      <style jsx>{`
        :global(.Account--input)
          display: grid; 
          grid-template-columns: 150px 1fr;
          @media (max-width: 832px)
            display flex
            flex-direction column
            & :global(div)
              margin-top: 10px
      `}</style>
    </div>
  )
}

export const getServerSideProps = connect(withSession(async ({ req, res }) => {
  const session = req.session.get('user')
  if (!session) return { redirect: { destination: '/login', permanent: false } }
  const user = await User.findById(session.userId)
  const restaurants = await Restaurant.find({ _id: { $in: user.restaurants } })

  return {
    props: { SSRrestaurants: JSON.parse(JSON.stringify(restaurants)) },
  }
}))

export default Account

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner} from 'theme-ui'
import theme from '../theme'
import React, { useState } from 'react'
import useUser from '../lib/hooks/useUser'
import Input from '../components/Input'

const OptionSection = ({title, children}) => (
  <>
    <h2 sx={{ variant: 'text.body', fontSize: 3, fontWeight: 'normal' }}>{title}</h2>
    <div sx={{ bg: 'white', p: 3, pb: 3, px: 3, maxWidth: '30rem', '& > *:not(:first-of-type)': { mt: 3 } }}>{children}</div>
  </>
)

const Account = () => {
  const { user } = useUser()
  console.log(user?.restaurants)
  return (
    <div
      sx={{ 
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        minHeight: `calc(100vh - ${ theme.sizes.footer + theme.sizes.header }px)`
      }}
    >
      <nav
        sx={{ 
          bg: 'white',
          borderRight: '1px solid lightgrey', p: 0, m: 0
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
      {user && <section sx={{ px: 3 }}>
        <h1>Général</h1>
        <OptionSection title={'Utilisateur'}>
          <div className="Account--input">
            Email : 
            <Input 
              defaultValue={user.email}
              variant={'bold'} 
              options={{ 
                max: 40,
                empty: { 
                  prevent: true,
                  err: 'Vous devez entrez votre email !' 
                },
                validator: { 
                  match: value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value),
                  err: 'Verifiez votre adresse mail !',
                },
              }}
            />
          </div>
          <div>Changer mon mot de passe</div>
          <div sx={{ color: 'crimson' }}>Supprimer mon compte</div>
        </OptionSection>
        <OptionSection title={'Restaurants'}>
          {user && user?.restaurants.map((restaurant, i) => (
            <React.Fragment key={i}>
              <div>Ces informations s'afficheront sur votre carte</div>
              <div className="Account--input">Nom : <Input defaultValue={restaurant.name} /></div>
              <div className="Account--input">Description : <Input defaultValue={restaurant.name} /></div>
              <div className="Account--input">Adresse : <Input defaultValue={restaurant.name} /></div>
            </React.Fragment>
          ))}
        </OptionSection>
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

export default Account

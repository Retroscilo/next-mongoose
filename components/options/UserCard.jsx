/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Input from '../Input'
import React, { useState } from 'react'
import fetchJson from '../../lib/fetchJson'

const UserCard = ({ user, mutateUser }) => {
  const [ resetPass, setResetPass ] = useState(false)

  async function updateMail (field, newValue) {
    await fetchJson('/api/user', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newValue),
    })
    mutateUser(fetchJson('/api/user'))
    await fetchJson('/api/action/verifyMail')
  }

  async function resetPassword (mail) {
    setResetPass(true)
    await fetchJson('/api/action/password', {
      method: 'PUT',
      header: { 'content-type': 'application/json' },
      body: mail,
    })
  }

  async function deleteAccount () {
    await fetchJson('/api/user', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    })
    await fetchJson('api/logout')
    mutateUser()
  }

  return (
    <div sx={{ bg: 'white', p: 3, pb: 3, px: 3, maxWidth: '30rem', my: 3, '& > *:not(:first-of-type)': { mt: 4 } }}>
      <div
        className="Account--input"
        sx={{
          position: 'relative',
          '&::after': {
            content: user.verified ? '"Verifié"' : '"Non vérifié"',
            position: 'absolute',
            right: '-150px',
            top: '-50%',
            border: '2px solid',
            color: user.verified ? 'primary' : 'crimson',
            borderColor: user.verified ? 'primary' : 'crimson',
            borderRadius: '3px',
            px: 2,
            py: 1,
          },
        }}
      >
        Email :
        <Input
          defaultValue={user.email}
          variant={'bold'}
          update={updateMail}
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
      { !user.verified &&
        <div sx={{ variant: 'text.light', mt: 1 }}>
          Un mail de confirmation vous a été envoyé <br /> <br /> <span sx={{ color: 'text', cursor: 'pointer' }} onClick={() => fetchJson('/api/action/verifyMail')} > Renvoyer un mail de confirmation </span>
        </div> }
      { !resetPass && <div onClick={() => resetPassword(user.email)} sx={{ cursor: 'pointer' }} >Changer mon mot de passe</div>}
      { resetPass && <div>Vous allez recevoir un mail qui vous permettra de saisir un nouveau mot de passe !</div>}
      <div onClick={deleteAccount} sx={{ color: 'crimson', cursor: 'pointer' }}>Supprimer mon compte</div>
      <style jsx>{`
        .Account--input {
          display: grid; 
          grid-template-columns: 150px 1fr;
        }
      `}</style>
    </div>
  )
}

export default UserCard

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import Input from '../Input'
import React, { useState, useEffect } from 'react'
import fetchJson from '../../lib/fetchJson'

const UserCard = ({ user, mutateUser }) => {
  // reset password
  const [ resetPass, setResetPass ] = useState(false)
  //delete account
  const [ isSure, setIsSure ] = useState(false)
  const [ lastChance, setLastChance ] = useState(false)
  // re-sent confirmation mail
  const [ resent, setResent ] = useState(false)

  async function updateMail (field, newValue) {
    await fetchJson('/api/user', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newValue),
    })
    await fetchJson('/api/action/verifyMail')
    await mutateUser(fetchJson('/api/user'))
  }

  async function resetPassword (mail) {
    try {
      await fetchJson('/api/action/password', {
        method: 'PUT',
        header: { 'content-type': 'application/json' },
        body: mail,
      })
      setResetPass('Vous allez recevoir un mail qui vous permettra de saisir un nouveau mot de passe !')
    } catch (err) {
      setResetPass("Merci de vérifier d'abord votre email !")
    }
  }

  async function deleteAccount () {
    await fetchJson('/api/user', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    })
    await fetchJson('api/user/logout')
    mutateUser()
  }

  return (
    <div sx={{ bg: 'white', p: 3, pb: 3, px: 3, maxWidth: '30rem', my: 3, '& > *:not(:first-of-type)': { mt: 4 } }}>
      <div className="Account--input">
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
      { !user.verified && !resent &&
        <div sx={{ variant: 'text.light', mt: 1 }}>
          Un mail de confirmation vous a été envoyé <br /> <br />
          <span sx={{ color: 'text', cursor: 'pointer' }} onClick={() => { fetchJson('/api/action/verifyMail'); setResent(true) }} > Renvoyer un mail de confirmation </span>
        </div>}
      { resent && <div sx={{ variant: 'text.light' }}> Nous vous avons renvoyé un mail de confirmation ! </div> }
      { !resetPass && <div onClick={() => resetPassword(user.email)} sx={{ cursor: 'pointer' }} >Changer mon mot de passe</div>}
      { resetPass && <div sx={{ variant: 'text.light' }}>{resetPass}</div>}
      <div sx={{ color: 'crimson', cursor: 'pointer' }}>
        {!isSure && !lastChance && <div onClick={() => setIsSure(true)}>Supprimer mon compte</div>}
        {isSure === true &&
        <>
          Êtes-vous sur ? 🤨<br /> Tout vos restaurants et toutes vos cartes vont être supprimés de nos bases de données et vos abonnements vont être résiliés.
          <div sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 3 }}>
            <div sx={{ variant: 'Button.primary' }} onClick={() => setIsSure(false)}>Annuler</div>
            <div onClick={() => { setIsSure(false); setLastChance(true) }}>Confirmer</div>
          </div>
        </>}
        {lastChance &&
        <>
          C'est votre dernier mot ? C'est vraiment un adieu ? 😱
          <div sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 3 }}>
            <div sx={{ variant: 'Button.primary' }} onClick={() => setLastChance(false)}>Non, je plaisantais 😜</div>
            <div onClick={deleteAccount}>Oui, adieu 😥</div>
          </div>
        </>
        }
      </div>
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

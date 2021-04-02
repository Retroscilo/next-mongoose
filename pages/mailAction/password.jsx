/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'
import  React, { useState, useEffect } from 'react'
import Input from '../../components/Input'
import fetchJson from '../../lib/fetchJson'

const MailAction = () => {
  const router = useRouter()
  const [ verified, setVerified ] = useState(false)
  const [ error, setError ] = useState(false)
  useEffect(async () => {
    if (router.query.code !== undefined)
      try {
        await fetchJson('/api/action/password', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(router.query.code),
        })
        setVerified(true)
      } catch (err) {
        setError(err.data.body)
      }
  }, [ router.query.code ])
  const changePassword = async e => {
    e.preventDefault()
    console.log(router.query.code)
    await fetchJson('/api/action/password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: router.query.code, pass: e.target.password.value }),
    })
  }
  return (
    <div sx={{ width: '100%', height: 'min', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {!verified &&
      <>
        <h1>Saisissez votre nouveau mot de passe</h1>
        <form onSubmit={changePassword}>
          <input name="password" type="text" />
          <button type="submit" />
        </form>
      </>
      }
    </div>
  )
}

export default MailAction

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import fetchJson from '../../lib/fetchJson'

const MailAction = () => {
  const router = useRouter()
  const [ verified, setVerified ] = useState(false)
  const [ error, setError ] = useState(false)
  useEffect(async () => {
    if (router.query.code !== undefined)
      try {
        await fetchJson(`/api/action/verifyMail`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(router.query.code),
        })
        setVerified(true)
        setTimeout(() => {
          router.replace('/account')
        }, 2000)
      } catch (err) {
        console.log(err.data)
        setError(err.data.body)
      }
  }, [ router.query.code ])
  return (
    <div sx={{ width: '100%', height: 'min', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {(!verified && !error) &&
        <>
          <h1>Nous activons votre compte</h1>
          <Spinner />
        </>}
      {(!verified && error) &&
        <div>
          {error}
        </div>
      }
      {verified &&
        <div sx={{ textAlign: 'center' }}>
          <h1>Vous avez bien confirmé votre mail !</h1> <br /> <br />
          Vous allez être redirigé dans un instant...
        </div>}
    </div>
  )
}

export default MailAction

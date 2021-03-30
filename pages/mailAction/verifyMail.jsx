/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import fetchJson from '../../lib/fetchJson'

const MailAction = () => {
  const router = useRouter()
  const [ verified, setVerified ] = useState(false)
  useEffect(async () => {
    if (router.query.code !== undefined)
      try {
        await fetchJson(`/api/action/verifyMail`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(router.query.code),
        })
        setVerified(true)
      } catch (err) {
        console.log(err)
      }
  }, [ router.query.code ])
  return (
    <div sx={{ width: '100%', height: 'min', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {!verified &&
        <>
          <h1>Nous activons votre compte</h1>
          <Spinner />
        </>}
      {verified &&
        <div>test</div>}
    </div>
  )
}

export default MailAction

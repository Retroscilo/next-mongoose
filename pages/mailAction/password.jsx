/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import Router, { useRouter } from 'next/router'
import React, { useState } from 'react'
import Input from '../../components/Input'
import fetchJson from '../../lib/fetchJson'
import Form from '../../components/form'

const MailAction = () => {
  const router = useRouter()
  const [ passReset, setPassReset ] = useState(false)
  const [ error, setError ] = useState('')

  const changePassword = async e => {
    e.preventDefault()
    try {
      await fetchJson('/api/action/password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...router.query, newPass: e.target.password.value }),
      })
      setPassReset(true)
      setTimeout(() => {
        Router.replace('/login')
      }, 2000)
    } catch (err) {
      setError(err.data.message)
    }
  }

  return (
    <div sx={{ width: '100%', height: 'min', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {!passReset &&
      <>
        <Form
          errorMessage={error}
          onSubmit={changePassword}
          title={'Réinitialiser votre mot de passe'}
          fields={[
            { type: 'text', name: 'password' },
          ]}
        >
          <button type="submit" sx={{ variant: 'Button.primary', alignSelf: 'flex-start' }}>Réinitialiser</button>
        </Form>
      </>
      }
      {passReset && <div sx={{ textAlign: 'center' }}>Votre nouveau mot de passe est enregistré ! <br /> Redirection...</div>}
    </div>
  )
}

export default MailAction

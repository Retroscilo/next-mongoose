/** @jsxRuntime classic */
/** @jsx jsx */
/* import { Formik, Form, Field, ErrorMessage } from 'formik' */
import { jsx } from 'theme-ui'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/hooks/useUser'
import Form from '../components/form'
import React, { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/cards',
    redirectIfFound: true,
  })

  const [ errorMsg, setErrorMsg ] = useState('')
  const [ forgottenPass, setForgottenPass ] = useState(false)
  const [ mailSent, setMailSent ] = useState(false)

  const sendReset = async e => {
    e.preventDefault()
    try {
      await fetchJson('/api/action/password', {
        method: 'PUT',
        header: { 'content-type': 'application/json' },
        body: e.target.mail.value,
      })
      setMailSent(true)
    } catch (err) {
      console.log(err.data.message)
      setErrorMsg(err.data.message)
    }
  }

  async function handleSubmit (e) {
    e.preventDefault()

    const body = {
      email: e.currentTarget.mail.value,
      password: e.currentTarget.password.value,
    }
    try {
      await mutateUser(
        fetchJson('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
  }

  return (
    <div sx={{ display: 'grid', gridTemplateColumns: [ '1fr', '1fr 20rem' ], height: 'min', justifyItems: 'center', alignItems: 'center' }}>
      <div className="login">
        {!forgottenPass &&
        <>
          <Form onSubmit={handleSubmit} errorMsg={errorMsg}>
            <h1>Connectez-vous à votre compte</h1>
            <label htmlFor="mail">E-mail</label>
            <input type="text" name="mail" />
            <span sx={{ display: 'flex', justifyContent: 'space-between' }}><label htmlFor="password">Mot de passe</label><span sx={{ cursor: 'pointer', mt: 4, color: 'primary' }} onClick={() => { setForgottenPass(true); setErrorMsg('') }}>Mot de passe oublié ?</span></span>
            <input type="password" name="password" />
            <input type="submit" value="Continuer" />
          </Form>
          <Link href="/signup">
            <a sx={{ mt: 3, display: 'inline-block', color: 'textLight' }}>Pas de compte ? <span sx={{ color: 'primary', cursor: 'pointer' }}>S'inscrire</span></a>
          </Link>
        </>}
        {forgottenPass &&
        <>
          {!mailSent &&
          <>
            <Form onSubmit={sendReset} errorMsg={errorMsg}>
              <h1>Récupérez votre mot de passe</h1>
              <label htmlFor="mail">E-mail</label>
              <input name="mail" type="text" />
              <input type="submit" value="Réinitialiser mon mot de passe" />
            </Form>
            <div sx={{ mt: 3, display: 'inline-block', color: 'primary', cursor: 'pointer' }} onClick={() => { setForgottenPass(false); setErrorMsg('') }}>C'est bon, je m'en souviens !</div>
          </>}
          {mailSent && <div><Form>Nous vous avons envoyé un mail pour que vous puissiez réinitialiser votre mot de passe.</Form></div>}
        </>}
      </div>
      <div
        sx={{ display: [ 'none', 'initial' ], height: '100%', background: 'url(/illustration--signin.svg) no-repeat', backgroundSize: 'contain', backgroundPosition: 'center 70%', color: '#17202C', fontSize: 5, fontWeight: 'medium', pt: 5, px: 3 }}
      >Créez votre carte digitale en 5 minutes</div>
    </div>
  )
}

export default Login

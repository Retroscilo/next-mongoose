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
  const [ forgottenPass, setForgottenPass ] = useState(false)

  return (
    <div sx={{ display: 'grid', gridTemplateColumns: [ '1fr', '0.7fr 0.3fr' ], height: 'min', justifyItems: 'center', alignItems: 'center' }}>
      <div className="login">
        <AnimatePresence initial={false}>
          {!forgottenPass && <SigninForm setForgottenPass={setForgottenPass} />}
          {forgottenPass && <RecoverPassForm setForgottenPass={setForgottenPass} />}
        </AnimatePresence>
      </div>
      <div
        sx={{ display: [ 'none', 'flex' ], flexDirection: 'column', height: '100%', color: '#17202C', fontSize: 6, fontWeight: 'medium', pt: 1, px: 3 }}
      >
        <p>Créez votre menu digital en 5 minutes</p>
        <div sx={{ background: 'url(/illustration--signin.svg) no-repeat', backgroundSize: 'contain', backgroundPosition: 'center 70%', height: '100%', width: '100%' }} />
      </div>
    </div>
  )
}

const RecoverPassForm = ({ setForgottenPass }) => {
  const [ mailSent, setMailSent ] = useState(false)
  const [ errorMsg, setErrorMsg ] = useState('')

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

  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
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
    </motion.div>
  )
}

const SigninForm = ({ setForgottenPass }) => {
  const { mutateUser } = useUser({
    redirectTo: '/cards',
    redirectIfFound: true,
  })

  const [ errorMsg, setErrorMsg ] = useState('')

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

  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
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
    </motion.div>
  )
}

export default Login

/** @jsxRuntime classic */
/** @jsx jsx */
/* import { Formik, Form, Field, ErrorMessage } from 'formik' */
import { jsx } from 'theme-ui'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/hooks/useUser'
import Form from '../components/form'
import React, { useState } from 'react'
import Link from 'next/link'

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/cards',
    redirectIfFound: true,
  })

  const [ errorMsg, setErrorMsg ] = useState('')
  const [ forgottenPass, setForgottenPass ] = useState(false)
  const [ mailSent, setMailSent ] = useState(false)

  const sendReset = async e => {
    try {
      e.preventDefault()
      await fetchJson('/api/action/password', {
        method: 'PUT',
        header: { 'content-type': 'application/json' },
        body: e.target.Email.value,
      })
      setMailSent(true)
    } catch (err) {
      setErrorMsg(err.data.body)
    }
  }

  async function handleSubmit (e) {
    e.preventDefault()

    const body = {
      email: e.currentTarget.Email.value,
      password: e.currentTarget['Mot de passe'].value,
    }
    try {
      await mutateUser(
        fetchJson('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
  }

  return (
    <div sx={{ display: 'grid', gridTemplateColumns: [ '1fr', '1fr 20rem' ], height: 'min', justifyItems: 'center', alignItems: 'center' }}>
      <div className="login">
        {!forgottenPass &&
        <>
          <Form
            errorMessage={errorMsg}
            onSubmit={handleSubmit}
            title={'Connection'}
            fields={[
              { type: 'email', name: 'Email' },
              { type: 'text', name: 'Mot de passe' },
            ]}
          >
            <button type="submit" sx={{ variant: 'Button.primary', alignSelf: 'flex-start' }}>Connection</button>
          </Form>
          <Link href="/signup">
            <a sx={{ pl: 3 }}>Pas de compte ? S'inscrire</a>
          </Link>
          <div sx={{ pl: 3 }} onClick={() => setForgottenPass(true)}>Mot de passe oublié ?</div>
        </>}
        {forgottenPass &&
        <>
          {!mailSent &&
          <>
            <Form
              errorMessage={errorMsg}
              onSubmit={sendReset}
              title={'Mot de passe oublié'}
              fields={[
                { type: 'email', name: 'Email' },
              ]}
            >
              <button type="submit" sx={{ variant: 'Button.primary', alignSelf: 'flex-start' }}>Réinitialiser mon mot de passe</button>
            </Form>
            <div sx={{ pl: 3 }} onClick={() => setForgottenPass(false)}>C'est bon, je m'en souviens !</div>
          </>}
          {mailSent && <div>Nous vous avons envoyé un mail pour que vous puissiez réinitialiser votre mot de passe.</div>}
        </>}
      </div>
      <div
        sx={{ display: [ 'none', 'initial' ], height: '100%', background: 'url(/qrIllustration.webp) no-repeat', backgroundSize: 'contain', backgroundPosition: 'bottom', backgroundColor: '#D6D8DE', color: '#17202C', fontSize: 4, fontWeight: 'medium', pt: 5, px: 3 }}
      >Créez votre carte digitale en 5 minutes</div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export default Login

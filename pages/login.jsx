/** @jsxRuntime classic */
/** @jsx jsx */
/* import { Formik, Form, Field, ErrorMessage } from 'formik' */
import { jsx } from 'theme-ui'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/hooks/useUser'
import Form from '../components/form'
import { useState } from 'react'

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  })

  const [ errorMsg, setErrorMsg ] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()

    const body = {
      email: e.currentTarget.Email.value,
      password: e.currentTarget["Mot de passe"].value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
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
    <div>
      <div className="login">
        <Form
          errorMessage={errorMsg}
          onSubmit={handleSubmit}
          title={'Connection'}
          fields={[
            { type:"email", name:"Email" },
            { type:"text", name:"Mot de passe" },
          ]}
        >
          <button type="submit" sx={{ variant: 'Button.primary', alignSelf: 'flex-start' }}>Connection</button>
        </Form>
      </div>
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

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/useUser'
import Form from '../components/form'
import { useState } from 'react'

const SignUp = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  })

  const [ errorMsg, setErrorMsg ] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/signup', {
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
      <div className="signup">
        <Form
          isLogin errorMessage={ errorMsg }
          onSubmit={ handleSubmit }
        />
      </div>
      <style jsx>{`
        .signup {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }`}
      </style>
    </div>
  )
}

export default SignUp

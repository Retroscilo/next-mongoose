/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner} from 'theme-ui'
import theme from '../theme'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/hooks/useUser'
import Form from '../components/form'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

const SignUp = () => {
  const { mutateUser } = useUser()
  const router = useRouter()
  const [ isSignedUp, setIsSignedUp ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ errorMsg, setErrorMsg ] = useState('')

  async function signUp (e) {
    e.preventDefault()
    setIsLoading(true)

    const body = {
      email: e.currentTarget.Email.value,
      password: e.currentTarget['Mot de passe'].value,
    }

    try {
      await mutateUser(
        fetchJson('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      )
      setIsSignedUp(true)
    } catch (error) {
      switch(error.data.error.code) {
        case 11000: setErrorMsg('Ce mail est déjà utilisé'); break;
        default: setErrorMsg("Nous rencontrons des difficultées. Essayez de recharger la page.")
      }
    }
    setIsLoading(false)
  }

  async function addRestaurant (e) {
    e.preventDefault()
    setIsLoading(true)
    const body = { restaurantName: e.target['Nom de votre restaurant'].value }

    try {
      await fetchJson('/api/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      router.push('/cards')
    } catch (err) {
      setErrorMsg("Nous rencontrons des difficultées. Essayez de recharger la page.")
    }
  }

  const checkMail = value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
  const checkPassword = value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)

  return (
    <div sx={{ display: 'grid', gridTemplateColumns: ['1fr', '20rem 1fr'], height: 'min', justifyItems: 'center', alignItems: 'center' }}>
      <div
        sx={{ display: ['none', 'initial'], height: '100%', background: 'url(/qrIllustration.webp) no-repeat', backgroundSize: 'contain', backgroundPosition: 'bottom', backgroundColor: '#D6D8DE', color: '#17202C', fontSize: 4, fontWeight: 'medium', pt: 5, px: 3 }}
      >Créez votre carte digitale en 5 minutes</div>
      {!isSignedUp &&
        <Form
          onSubmit={signUp}
          title={'Créer un compte Pixme'}
          errorMessage={errorMsg}
          fields={[
            { type: 'text', name: 'Email', check: checkMail, error: 'Vérifiez votre email !' },
            { type: 'text', name: 'Mot de passe', check: checkPassword, error: 'Mot de passe invalide !', legend: '8 charactères minimum, au moins un chiffre et une lettre' },
          ]}
        >
          <span sx={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start' }}><button type="submit" sx={{ variant: 'Button.primary' }}>On y va !</button>{isLoading && <Spinner height={30} />}</span>
        </Form>
      }
      {isSignedUp &&
      <Form 
        onSubmit={addRestaurant}
        title={'Quel est le nom de votre restaurant ?'}
        subTitle={'(Vous pourrez le modifier plus tard dans vos réglages)'}
        fields={[
          { type: 'text', name: 'Nom de votre restaurant', check: value => value.length > 0}
        ]}
      >
        <span sx={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start' }}><button type="submit" sx={{ variant: 'Button.primary' }}>On y va !</button>{isLoading && <Spinner height={30} />}</span>
      </Form>
      }
    </div>
  )
}

export default SignUp

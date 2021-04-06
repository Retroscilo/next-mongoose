/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import theme from '../theme'
import fetchJson from '../lib/fetchJson'
import useUser from '../lib/hooks/useUser'
import Form from '../components/form'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const Page = () => {
  const [ step, setStep ] = useState(1)
  return (
    <div sx={{ display: 'grid', gridTemplateColumns: [ '1fr', '20rem 1fr' ], height: 'min', justifyItems: 'center', alignItems: 'center' }}>
      <div
        sx={{ display: [ 'none', 'initial' ], height: '100%', background: 'url(/qrIllustration.webp) no-repeat', backgroundSize: 'contain', backgroundPosition: 'bottom', backgroundColor: '#D6D8DE', color: '#17202C', fontSize: 4, fontWeight: 'medium', pt: 5, px: 3 }}
      >
        Créez votre carte digitale en 5 minutes
      </div>
      <div>
        <AnimatePresence>
          {step === 1 && <SignUpForm setStep={setStep} />}
          {step === 2 && <RestoForm setStep={setStep} />}
          {step === 3 && <Thanks />}
        </AnimatePresence>
      </div>
    </div>
  )
}

const SignUpForm = ({ setStep }) => {
  const { mutateUser } = useUser()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ errorMsg, setErrorMsg ] = useState('')

  async function signUp (e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await fetchJson('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e.currentTarget.email.value, password: e.currentTarget.password.value }),
      })
      mutateUser(fetchJson('/api/user'))
      await fetchJson('/api/action/verifyMail')
      setIsLoading(false)
      setStep(2)
    } catch (error) {
      setErrorMsg(error.data.message)
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="signup"
      initial={{ x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Form onSubmit={signUp} errorMsg={errorMsg}>
        <h1>S'inscrire sur Qarte</h1>
        <label htmlFor="email">E-mail</label>
        <input name="email" type="email" />
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" />
        <sub>8 charactères minimum.</sub>
        {!isLoading && <input type="submit" value="continuer" />}
        {isLoading && <div sx={{ width: '100%', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', bg: 'primary', mt: 4 }}><Spinner height={30} color={'white'} /></div>}
      </Form>
      <Link href="/login">
        <a sx={{ color: 'textLight', mt: 3, display: 'inline-block' }}>Déjà un compte ? <span sx={{ color: 'primary', cursor: 'pointer' }}>Se connecter</span></a>
      </Link>
    </motion.div>
  )
}

const RestoForm = ({ setStep }) => {
  const [ errorMsg, setErrorMsg ] = useState('')

  async function addRestaurant (e) {
    e.preventDefault()
    if (e.target.restaurantName.value.length === 0) return setErrorMsg('Merci de saisir un nom pour votre restaurant.')
    try {
      await fetchJson('/api/restaurant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e.target.restaurantName.value),
      })
      setStep(3)
    } catch (err) {
      setErrorMsg(err.message)
    }
  }

  return (
    <motion.div
      key="resto"
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Form onSubmit={addRestaurant} errorMsg={errorMsg}>
        <h1>Dites-nous en un peu plus</h1>
        <h2>Nous avons besoin d'informations pour paramétrer votre compte.</h2>
        <label htmlFor="restaurantName">Comment s'appelle votre restaurant ?</label>
        <input name="restaurantName" type="text" />
        <label htmlFor="description">Quelques mots sur votre restaurant ? (optionnel)</label>
        <textarea
          type="text"
          name="description"
          rows="3"
          placeholder="Découvrez le meilleur de de la Street Food thaïlandaise comme si vous y étiez ! Produit bio et français, cuisine maison & plus encore !"
        />
        <input type="submit" value="continuer" />
      </Form>
    </motion.div>
  )
}

const Thanks = ({ setStep }) => {
  console.log('inscrit !')
  return (
    <motion.div
      key="thanks"
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Form>
        <h1 sx={{ mb: 2 }}>Merci pour votre inscription ! 🥳</h1>
        <p>
          Pour commencer à créer vos cartes digitales : <br /> ☞ &nbsp;
          <Link href="/cards">
            <a sx={{ color: 'primary', mt: 3, display: 'inline-block', cursor: 'pointer' }}>  Mes cartes</a>
          </Link>
        </p>
        <p>
          Pour changer des informations relatives à votre profil ou à votre restaurant : <br /> ☞ &nbsp;
          <Link href="/account">
            <a sx={{ color: 'primary', mt: 3, display: 'inline-block', cursor: 'pointer' }}>  Mes options</a>
          </Link>
        </p>
      </Form>
    </motion.div>
  )
}

export default Page

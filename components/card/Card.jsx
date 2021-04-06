/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import { motion, useAnimation } from 'framer-motion'
import Input from '../Input'

const Card = ({ name, id, update, active, setActive, updateName, deleteCard }) => {
  const router = useRouter()
  const [ options, setDisplayOptions ] = useState(false)
  const wrapperRef = useRef(null)

  // close options on outside click
  useClickOutside(wrapperRef, setDisplayOptions)
  const [ isHover, setIsHover ] = useState(false)
  const optionsControl = useAnimation()

  function displayOptions (e) {
    e.stopPropagation()
    setDisplayOptions(true)
  }

  // delete query + update '/cards/index'
  async function handleDelete (e) {
    e.preventDefault()
    const body = { id }
    await fetchJson('/api/cards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    update()
  }

  return (
    <motion.div
      ref={wrapperRef} sx={{ variant: active ? 'Card.active' : 'Card.default' }}
      onClick={() => router.push(`/cards/${ id }`)}
      id={id}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <div
        onClick={displayOptions}
        sx={{
          background: 'black',
          borderRadius: '100px',
          position: 'absolute',
          width: '10px',
          height: '10px',
          top: '10px',
          right: '10px',
        }}
      />
      <Input
        defaultValue={name}
        variant={'hBold'}
        update={updateName}
        field={id}
        options={{
          empty: {
            prevent: true,
            err: 'Vous devez nous donner un nom pour votre carte !',
          },
          after: isHover ? 'url(/editAlt.svg)' : '',
        }}
      />
      <motion.div
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 3 }}
        animate={isHover ? 'extended' : 'closed'}
        variants={{
          closed: { height: 0, opacity: 0 },
          extended: { height: 'fit-content', opacity: 1 },
        }}
        transition={{ opacity: { duration: 0.2 }, height: { duration: 0.2 } }}
        initial="closed"
      >
        {!active &&
        <div
          sx={{ bg: 'primary', color: 'white', p: '5px 12px', borderRadius: '3px' }}
          onClick={e => {
            e.stopPropagation()
            setActive(id)
          }}
        >
          Définir comme actif
        </div>}
        <div sx={{ mt: 2 }}>Modifier</div>
        <div
          sx={{ color: 'crimson', mt: 2 }}
          onClick={e => {
            e.stopPropagation()
            deleteCard(id)
          }}
        >Supprimer</div>
      </motion.div>
    </motion.div>
  )
}

export default Card

Card.propTypes = {
  active: PropTypes.bool,
  description: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  update: PropTypes.func,
}

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import fetchJson from '../lib/fetchJson'
import { useClickOutside } from '../lib/hooks/useClickOutside'

const Card = ({ name, description, id, update }) => {
  const router = useRouter()
  const [ options, setDisplayOptions ] = useState(false)
  const wrapperRef = useRef(null)

  // close options on outside click
  useClickOutside(wrapperRef, setDisplayOptions)

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
    <div
      ref={wrapperRef} sx={{ variant: 'Card' }}
      onClick={() => router.push(`/cards/${ id }`)}
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
      <h1>{name}</h1>
      <p>{description}</p>
      {options && (
        <div sx={{ bg: 'white', width: '100%', height: '100%', position: 'absolute', top: '0' }} onClick={e => e.stopPropagation()}>
          <ul>
            <li onClick={() => console.log('test')}>modifier</li>
            <li onClick={handleDelete}>supprimer</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Card

Card.propTypes = {
  description: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  update: PropTypes.func,
}

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import Input from '../Input'
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react'
import fetchJson from '../../lib/fetchJson'
import IconSelector from '../IconSelector'
import QRCode from 'qrcode'
import propTypes from 'prop-types'

const QR = ({ restaurant }) => {
  const { _id: id, restaurantName: name, QR } = restaurant
  const { color: defaultColor, logo, shape, frame } = QR || {}
  const canvasc = useRef(null)
  const [ canvasReady, setCanvasReady ] = useState(false)
  const [ color, setColor ] = useState(defaultColor || '#000:#FFF')

  const dlCanvas = e => {
    let dt = document.querySelector('canvas').toDataURL('image/png')
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
    dt = dt.replace(/^data:application\/octet-stream/, `data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=QRCode_${ name }.png`)
    e.target.href = dt
  }

  const drawCanvas = async colors => {
    const c = colors.split(':')
    await QRCode.toCanvas(canvasc.current, 'https://localhost:3000/cards/' + id + '?user', { color: { dark: c[0], light: c[1] }, errorCorrectionLevel: 'M' })
    setCanvasReady(true)
  }
  useEffect(async () => {
    drawCanvas(color)
    await fetchJson('/api/QR', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, field: 'color', value: color }),
    })
  }, [ color ])

  return (
    <div sx={{ display: 'grid', gridTemplateAreas: '"custom qr" "custom qr" "download qr"' }}>
      <span sx={{ display: 'flex', gridArea: 'custom', flexDirection: 'column', '& > *': { mt: 2 } }}>
        <span sx={{ display: 'flex' }}>
          Couleur: &nbsp;
          <IconSelector
            icons={[
              { value: '#000:#FFF', url: '/selectIcons/bw.svg' },
              { value: '#03018C:#FFF', url: '/selectIcons/blw.svg' },
              { value: '#FF4D4D:#FFF', url: '/selectIcons/rw.svg' },
              { value: '#FF8008:#FFF', url: '/selectIcons/yw.svg' },
              { value: '#FFF:#000', url: '/selectIcons/wb.svg' },
            ]}
            options={{ iconSize: '20px', callback: value => setColor(value), defaultColor: color }}
          />
        </span>
        <span>Logo: <span sx={{ color: 'textLight' }}>Bientôt !</span></span>
        <span>Forme: <span sx={{ color: 'textLight' }}>Bientôt !</span></span>
        <span>Cadre: <span sx={{ color: 'textLight' }}>Bientôt !</span></span>
      </span>
      {!canvasReady && <Spinner />}
      <canvas
        ref={canvasc}
        width="300"
        height="300"
        sx={{ opacity: canvasReady ? 1 : 0, border: '2px solid lightgrey', gridArea: 'qr', justifySelf: 'end' }}
      >
        Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.
      </canvas>
      <a
        download={`QRCode_${ name }`} href="#"
        onClick={e => dlCanvas(e)}
        sx={{ display: 'block', variant: 'Button.primary', gridArea: 'download', alignSelf: 'end' }}
      >
        Télécharger mon QR Code
      </a>
    </div>
  )
}

const RestaurantCard = ({ restaurant, mutate }) => {
  const [ confirmDelete, setConfirmDelete ] = useState(false)

  async function modifyRestaurant (restaurantId, body) {
    try {
      await fetchJson(`/api/restaurant/${ restaurantId }`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (err) {
      console.log('err')
    }
    mutate()
  }

  async function deleteRestaurant (restaurantId) {
    await fetchJson(`/api/restaurant/${ restaurantId }`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
    })
    mutate()
  }

  return (
    <div key={restaurant._id} sx={{ bg: 'white', p: 3, pb: 3, px: 3, maxWidth: '30rem', my: 3, '& > *:not(:first-of-type)': { mt: 4 } }}>
      <div className="Account--input">
        Nom :
        <Input
          defaultValue={restaurant.restaurantName}
          field={'restaurantName'}
          update={(field, newValue) => modifyRestaurant(restaurant._id, { field, newValue })}
          options={{
            empty: {
              prevent: true,
              err: 'Vous devez nommer votre restaurant !',
            },
            max: 30,
            after: 'url(/editAlt.svg)',
          }}
        />
      </div>
      <div className="Account--input">
        Description :
        <Input
          defaultValue={restaurant.restaurantDescription || 'Ajouter une description'}
          variant={!restaurant.restaurantDescription ? 'light' : ''}
          field={'restaurantDescription'}
          update={(field, newValue) => modifyRestaurant(restaurant._id, { field, newValue })}
          options={{ max: 200, after: 'url(/editAlt.svg)', width: '300px', maxHeight: '95px' }}
        />
      </div>
      <QR restaurant={restaurant} />
      {!confirmDelete &&
      <div
        sx={{ color: 'crimson', cursor: 'pointer' }}
        onClick={() => setConfirmDelete(restaurant._id)}
      >Supprimer ce restaurant</div>}
      {confirmDelete === restaurant._id &&
      <div sx={{ color: 'crimson' }}>
        Êtes-vous sûr ? Toutes les cartes seront également supprimées.
        <span sx={{ display: 'flex', maxWidth: '15rem', mx: 'auto', mt: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <div sx={{ variant: 'Button.primary' }} onClick={() => setConfirmDelete(false)}>Annuler</div>
          <div sx={{ cursor: 'pointer' }} onClick={() => { deleteRestaurant(restaurant._id); setConfirmDelete(false) }}>Confirmer</div>
        </span>
      </div>}
      <style jsx>{`
        .Account--input {
          display: grid; 
          grid-template-columns: 150px 1fr;
        }
      `}</style>
    </div>
  )
}

export default RestaurantCard

QR.propTypes = { restaurant: propTypes.object }

RestaurantCard.propTypes = {
  mutate: propTypes.func,
  restaurant: propTypes.object,
}

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Styled, Spinner } from 'theme-ui'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import fetchJson from '../lib/fetchJson'
import { useClickOutside } from '../lib/hooks/useClickOutside'

const SelectIcons = ({ icons, options = {} }) => {
  const O = { iconSize: '10px', width: '200px', ...options }
  console.log(icons[0])
  const [ selected, setSelected ] = useState(icons[0])
  const [ displaySelectBox, setDisplaySelectBox ] = useState(false)
  const selectBox = useRef(null)
  const toggleSelectBox = () => setDisplaySelectBox(!displaySelectBox)
  useClickOutside(selectBox, () => setDisplaySelectBox(false))
  const handleSelect = icon => {
    setSelected(icon)
    icon.callback(icon.value)
    toggleSelectBox()
  }

  return (
    <div sx={{ position: 'relative' }} ref={selectBox}>
      <div
        onClick={toggleSelectBox}
        sx={{ background: `url(${selected.url})`, width: O.iconSize, height: O.iconSize, backgroundSize: 'cover', border: '1px solid lightgrey', borderRadius: '100px', cursor: 'pointer' }}
      />
      <div 
        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', width: O.width, bg: 'white', borderRadius: '100px', boxShadow: 'low', my: 2, pl: 3, pb: 2, position: 'absolute', opacity: displaySelectBox ? 1 : 0, transform: displaySelectBox ? 'translate(-45%, 0)' : 'translate(-45%, -10px)', transition: 'all 0.3s ease' }}
      >
        {icons.map((icon, i) => 
        <span
          key={i}
          onClick={() => handleSelect(icon)} 
          sx={{ background: `url(${icon.url})`, width: O.iconSize, height: O.iconSize, backgroundSize: 'cover', border: '1px solid lightgrey', borderRadius: '100px', mr: 3, mt: 2, cursor: 'pointer' }}
        />)}
      </div>
    </div>
  )
}

const QRCard = ({ restaurant, QR }) => {
  const canvasc = useRef(null)
  const dlCanvas = e => {
    let dt = canvasc.current.toDataURL('image/png')
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
    dt = dt.replace(/^data:application\/octet-stream/, `data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=QRCode_${restaurant.restaurantName}.png`)
    e.target.href = dt
  }
  const [ canvasReady, setCanvasReady ] = useState(false)
  const drawCanvas = async colors => {
    const c = colors.split(':')
    await QRCode.toCanvas(canvasc.current, 'texttexttexttexttexttexttexttexttexttexttexttexttex', { color: { dark: c[0], light: c[1] }, errorCorrectionLevel: 'L' })
    setCanvasReady(true)
  }
  useEffect(async () => drawCanvas('#000:#FFF'), [])

  return (
    <div sx={{ background: 'white', borderRadius: '3px', p: 3, width: '30em', display: 'grid', gridTemplateAreas: '"info info" "custom code" ""' }}>
      <span sx={{ display: 'flex', alignItems: 'center' }}>Couleur : &nbsp;
      <SelectIcons
        icons={[
          { value: '#000:#FFF', url: '/selectIcons/bw.svg', callback: drawCanvas },
          { value: '#03018C:#FFF', url: '/selectIcons/blw.svg', callback: drawCanvas },
          { value: '#FF4D4D:#FFF', url: '/selectIcons/rw.svg', callback: drawCanvas },
          { value: '#FF8008:#FFF', url: '/selectIcons/yw.svg', callback: drawCanvas },
          { value: '#FFF:#000', url: '/selectIcons/wb.svg', callback: drawCanvas },
        ]}
        options={{
          iconSize: '20px'
        }}
      /></span>
      {!canvasReady && <Spinner />}
      <canvas
        ref={canvasc}
        width="300"
        height="300"
        sx={{ opacity: canvasReady ? 1 : 0, border: '2px solid lightgrey' }}
      >
        Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.
      </canvas>
      <a
        download={`QRCode_${ restaurant.restaurantName }`} href="#"
        onClick={e => dlCanvas(e)}
        sx={{ display: 'block', variant: 'Button.primary' }}
      >Télécharger mon QR Code</a>
    </div>
  )
}

const theme = () => {
  const [ value, setValue ] = useState('Une description ?')

  const handleSubmit = async e => {
    e.preventDefault()
  }
  return (
    <div>
      {/* <Styled.h1>Lorem Ipsum</Styled.h1>
      <h2 sx={{ variant: 'styles.h2' }} >Lorem Ipsum</h2>
      <h3 sx={{ variant: 'styles.h3' }} >Lorem Ipsum</h3>
      <h4 sx={{ variant: 'styles.h4' }} >Lorem Ipsum</h4>
      <h5 sx={{ variant: 'styles.h5' }} >Lorem Ipsum</h5>
      <h6 sx={{ variant: 'styles.h6' }} >Lorem Ipsum</h6>
      <span sx={{ fontSize: 1 }}>W</span>
      <form onSubmit={handleSubmit}>
        <input type="text" name="text" />
        <input type="submit" value="tester" />
      </form> */}
      <QRCard restaurant={{ _id: '07c82b4965733', restaurantName: 'Le grand large' }} />
    </div>
)}

export default theme

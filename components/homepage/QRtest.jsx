/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect, useRef } from 'react'
import QR from '../../components/options/QR'

const QRtest = () => {
  const canvasRef = useRef(null)
  const [ canvasReady, setCanvasReady ] = useState(false)
  useEffect(() => QR('#000:#FFF', canvasRef.current, 'testcard').then(() => setCanvasReady(true)))
  return (
    <div sx={{ display: 'flex', mt: 4, alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width="300"
        height="300"
        sx={{ opacity: canvasReady ? 1 : 0, border: '2px solid lightgrey', gridArea: 'qr', justifySelf: 'end' }}
      >
        Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.
      </canvas>
      <p sx={{ ml: 3 }}>Flashez-moi et essayez directement sur votre téléphone ☞</p>
    </div>
  )
}

export default QRtest

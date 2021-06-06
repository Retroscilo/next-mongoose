/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState } from 'react'
import Link from 'next/link'
import Header from '../components/homepage/Header'
import QRtest from '../components/homepage/QRtest'

export default function Home () {
  return (
    <div sx={{ pb: 5 }}>
      <Header />
      <div sx={{ width: '100%', maxWidth: 'body', mx: 'auto' }}>
        <p>Rendez votre menu accessible par QR Code et personnalisez-le facilement. <br/> Essayez, <span sx={{ color: 'limegreen' }}>c’est gratuit !</span> </p>
        <QRtest />
      </div>
      {/* <div sx={{ padding: '0 100px', background: 'url(/qr.png)' }} >
      <div sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', minHeight: '80vh', justifyContent: 'space-between' }}>
        <h1 sx={{ color: 'white', fontSize: '72px' }}>Créez votre carte digitale en 5 minutes</h1>
        <p sx={{ color: 'white' }}>Digitalisez votre menu et obtenez un QR Code à imprimer pour vos clients. C’est rapide, facile et sécurisé avec PixMe !</p>
        <Link href="/login">
          <Button sx={{ background: 'white', boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)', color: '#F8B32C', cursor: 'pointer' }} >
            <a>C'est parti !</a>
          </Button>
        </Link>
        <div sx={{ display: 'flex', background: 'crimson', width: '100%', height: '50px', mt: '100px', alignItems: 'center', justifyContent: 'space-evenly' }} >
          <div sx={{ variant: 'SampleCards' }} />
        </div>
      </div>
      <div sx={{ background: 'linear-gradient(235.59deg, #F2F2F2 -0.31%, rgba(255, 255, 255, 0) 57.95%)' }}>
        <h2>C’est vous le chef !</h2>
        <p>Avec pixme, créez et modifiez votre menu quand vous le voulez. Changer un prix ? C’est fait en 30 secondes, et c’est gratuit !</p>
        <ul>
          <li>Simple d'utilisation</li>
          <li>Mise à jour immédiate</li>
          <li>C'est votre menu</li>
        </ul>
      </div>
    </div> */}
    </div>
  )
}

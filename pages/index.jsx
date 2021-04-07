/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home () {
  const test = 'mounted'

  return (
    <div>
      <div className={'animatedBackground'}>
        <div sx={{ position: 'absolute', right: 0 }}>
          <Image
            src={'/Phone.png'}
            className={'illustration'}
            width={1200}
            height={1400}
            layout={'intrinsic'}
            objectFit={'contain'}
            objectPosition={'200px 20vw'}
          />
        </div>
      </div>
      <div sx={{ maxWidth: '1120px', mx: 'auto', pl: 4, height: 'fit-content', mt: '100px' }} >
        <h1 sx={{ fontSize: 6, width: '40rem' }}>Une carte QR pour votre restaurant</h1>
        <p sx={{ fontSize: 3, lineHeight: 1.5, width: '40rem' }}>Digitalisez votre carte et obtenez un QR Code personnalisable qui permettra à vos clients de voir votre menu. C’est rapide, facile et sécurisé avec PixMe ! <br /> Le meilleur, c'est que c'est vous le chef: Vous gérez vos produits et votre carte est mise à jour instantanément.</p>
        <Link href="/login">
          <Button
            sx={{
              variant: 'Button.primaryAlternate.M',
            }}
          >
            <a>Démarrer maintenant</a>
          </Button>
        </Link>
      </div>
      <style jsx>{`
        .animatedBackground {
          z-index: -1;
          position: absolute;
          top: 0;
          height: 700px;
          width: 100%;
          transform: skewY(-6deg) translateY(-10vw);
          background: linear-gradient(210deg, #4158d0, #c850c0, #ffcc70);
          background-size: 150% 150%;
          -webkit-animation: AnimationName 10s ease infinite;
          -moz-animation: AnimationName 10s ease infinite;
          animation: AnimationName 10s ease infinite;
        }
        
        @-webkit-keyframes AnimationName {
            0%{background-position:24% 0%}
            50%{background-position:77% 100%}
            100%{background-position:24% 0%}
        }
        @-moz-keyframes AnimationName {
            0%{background-position:24% 0%}
            50%{background-position:77% 100%}
            100%{background-position:24% 0%}
        }
        @keyframes AnimationName {
            0%{background-position:24% 0%}
            50%{background-position:77% 100%}
            100%{background-position:24% 0%}
        }
      `}</style>
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

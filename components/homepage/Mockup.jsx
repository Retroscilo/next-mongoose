/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Menu from '../card/Menu'

const Mockup = ({ frame = 'blue' }) => {
  return (
    <div sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
      <div className='phone'>
        <div sx={{ width: '248px', height: '515px', position: 'relative', borderRadius: '30px', overflow: 'hidden' }}>
          <Image
            className={'frame'}
            priority
            quality={100}
            layout={'fill'}
            objectFit
            src={`/homepage/frame_${ frame }.jpg`}
            alt={"Aperçu d'un menu"}
          />
        </div>
      </div>
      <style jsx>{`
        .phone
          width: 264px
          height: 533px
          border-radius: 36px
          background: white
          box-shadow: -20px 0 100px -20px rgb(50 50 93 / 5%), inset 0 -2px 6px 0 rgb(10 37 64 / 15%)
          -webkit-user-select: none
          -moz-user-select: none
          -ms-user-select: none
          user-select: none
          font-size: 16px
          overflow: hidden
          padding 4px 5px 1px 5px
          display flex
          justify-content center
          align-items center
          padding-bottom 6px
        .frame
          border-radius 36px
        `}</style>
    </div>
  )
}

export default Mockup
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useViewport } from '../lib/hooks/useViewport'
import { useState } from 'react'

const CardHeader = ({ restaurantName, categories }) => {
  const { width } = useViewport()
  const mobile = width < 832

  return (
    <div sx={{ width: '100%', bg: 'white' }}>
      <div sx={{ maxWidth: 'body', pl: mobile ? 2 : 3, m: '0 auto' }}>
        <h1>Restaurant name</h1>
      </div>
    </div>
  )
}

export default CardHeader

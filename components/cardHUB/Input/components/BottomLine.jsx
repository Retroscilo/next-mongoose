/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useEffect, useState } from 'react'
import { useInputContext } from '../useInput'

const BottomLine = () => {
  const { active } = useInputContext()

  return (
    <div
      sx={{ width: active ? '100%' : 0, height: '3px', background: 'primary', transition: 'width .2s ease' }}
    />
  )
}

export { BottomLine }

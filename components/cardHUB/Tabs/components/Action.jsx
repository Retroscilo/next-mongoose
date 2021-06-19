/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useTabsContext } from '../useTabs'
import { useState, useEffect, useCallback } from 'react'

const Action = ({ onClick, disabled }) => {
  return (
    <div
      sx={{ position: 'relative', background: 'white', opacity: !disabled ? '1' : '.2', width: '22px', height: '22px', borderRadius: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'low', cursor: !disabled ? 'pointer' : 'initial' }}
      onClick={onClick}
    >
      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="9" width="20" height="2" fill="royalblue" />
        <rect x="9" y="20" width="20" height="2" transform="rotate(-90 9 20)" fill="royalblue" />
      </svg>
    </div>
  )
}

export { Action }

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRestaurants } from '../../../lib/hooks/useRestaurants'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { useState, useEffect, useRef, forwardRef, useCallback } from 'react'
import { Item, Action } from './components'
import { TabsContextProvider } from './useTabs'

const Tabs = ({ defaultSelection, onSelection, children }) => {
  return (
    <div
      sx={{
        position: 'relative',
        width: 'calc(100% + 2px)',
        maxWidth: 'calc(100% + 2px)',
        bg: 'royalblue',
        height: '45px',
        m: '-1px',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3Px',
        overflow: 'auto',
      }}
    >
      <ul sx={{ m: 0, color: 'white', display: 'flex', alignItems: 'center', height: '100%', width: 'fit-content' }}>
        <AnimateSharedLayout>
          <TabsContextProvider value={{ activeItemId: defaultSelection, setActiveItemId: onSelection }}>
            {children}
          </TabsContextProvider>
        </AnimateSharedLayout>
      </ul>
    </div>
  )
}

Tabs.Item = Item
Tabs.Action = Action

export default Tabs

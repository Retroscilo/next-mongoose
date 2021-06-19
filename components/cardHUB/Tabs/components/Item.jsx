/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useTabsContext } from '../useTabs'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
}

const Item = ({ id, children }) => {
  const { activeItemId, setActiveItemId } = useTabsContext()
  const [ active, setActive ] = useState(activeItemId === id)
  useEffect(() => setActive(activeItemId === id), [ activeItemId ])
  const handleClick = () => setActiveItemId(id)

  return (
  <li
    sx={{ position: 'relative', opacity: '.75', cursor: 'pointer', mr: 4, whiteSpace: 'nowrap' }}
    className={active ? 'activeTab' : ''}
    onClick={handleClick}
  >
    {children}
    {active && (
      <motion.div
        layoutId={'underline'}
        animate={{ backgroundColor: '#fff' }}
        initial={false}
        transition={spring}
        sx={{ height: '5px', width: '100%', backgroundColor: 'white', position: 'absolute', bottom: 0 }}
      />
    )}
    <style jsx>{`
      li
        height 100%
        display flex
        align-items center
        transition opacity .2s ease
        font-weight thin
      .activeTab
        font-weight normal
        opacity: 1
    `}</style>
  </li>
)}

export { Item }

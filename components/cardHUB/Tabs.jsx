/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRestaurants } from '../../lib/hooks/useRestaurants'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { useState, useEffect, useRef, forwardRef, useCallback } from 'react'

const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
}

const Tooltip = ({ text, color, pos, node }) => {
  const [ visible, setVisible ] = useState(false)
  const handleMouseLeave = () => setVisible(false)
  const handleMouseOver = () => setVisible(true)

  useEffect(() => {
    node.current.addEventListener('mouseover', handleMouseOver)
    node.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.current.removeEventListener('mousover', handleMouseOver)
      node.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ pos ])

  if (!pos) return null
  return (
    <div
      sx={{
        position: 'fixed',
        color: color || '',
        whiteSpace: 'nowrap',
        width: '500px',
        fontSize: 0,
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? '-10px' : 0})`,
        top: `${pos.top - pos.height/2}px`,
        left: `calc(${pos.left - 250 + pos.width/2}px)`,
        pointerEvents: 'none',
      }}
    >{text}</div>
  )
}

const Add = forwardRef(({ active, ...props }, ref) => (
  <div
    sx={{ position: 'relative', background: 'white', opacity: active ? '1' : '.2', width: '22px', height: '22px', borderRadius: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'low', cursor: active ? 'pointer' : 'initial' }}
    {...props}
    ref={ref}
  >
    <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="9" width="20" height="2" fill="royalblue" />
      <rect x="9" y="20" width="20" height="2" transform="rotate(-90 9 20)" fill="royalblue" />
    </svg>
  </div>
))

const Item = ({ item, setItem, active }) => (
  <li
    sx={{ position: 'relative', opacity: '.75', cursor: 'pointer', mr: 4, whiteSpace: 'nowrap' }}
    className={active ? 'activeTab' : ''}
    onClick={() => setItem(item)}
  >
    {item.restaurantName}
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
)

const Tabs = ({ active, items, setItem, action, activeAction }) => {
  const [ last, setLast ] = useState(false)
  const [ position, setPosition ] = useState(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (tooltipRef) setPosition(tooltipRef.current.getBoundingClientRect())
    if (!last) return
    setItem(items[items.length - 1])
    setLast(false)
  }, [ items ])

  const handleAction = () => {
    if (!activeAction) return
    action()
    setLast(true)
  }

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
        overflow: 'scroll'
      }}
    >
      <ul sx={{ m: 0, color: 'white', display: 'flex', alignItems: 'center', height: '100%', width: '1500px' }}>
        <AnimateSharedLayout>
          {items.map(item => (
            <Item key={item._id} item={item} setItem={setItem} active={item._id === active._id} />
          ))}
          <Add
            onClick={handleAction}
            active={activeAction}
            ref={tooltipRef}
          />
        </AnimateSharedLayout>
      </ul>
      <Tooltip node={tooltipRef} pos={position} text={activeAction ? 'ajouter un restaurant' : '3 restaurants maximum'} color={'white'} />
    </div>
  )
}

export default Tabs

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRestaurants } from '../../lib/hooks/useRestaurants'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { useState, useEffect, useRef, forwardRef } from 'react'

const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
}

const Tooltip = forwardRef(({ text, color }, ref) => {
  const [ position, setPosition ] = useState(null)
  const [ visible, setVisible ] = useState(false)
  const handleMouseLeave = () => setVisible(false)
  const handleMouseOver = () => setVisible(true)

  useEffect(() => {
    setPosition(ref.current.getBoundingClientRect())
    ref.current.addEventListener('mouseover', handleMouseOver)
    ref.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      ref.current.removeEventListener('mousover', handleMouseOver)
      ref.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ ref ])

  if (!position) return null
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
        top: `${position.top - position.height/2}px`,
        left: `calc(${position.left - 250 + position.width/2}px)`,
        transition: 'all .2s ease',
        pointerEvents: 'none',
      }}
    >{text}</div>
  )
})

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
    sx={{ position: 'relative', opacity: '.75', cursor: 'pointer', mr: 4 }}
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
  const [ visibleTooltip, setVisibleTooltip ] = useState(false)
  const [ last, setLast ] = useState(false)
  const tooltipRef = useRef(null)
  
  useEffect(() => {
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
        bg: 'royalblue',
        height: '45px',
        m: '-1px',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3Px',
      }}
    >
      <ul sx={{ m: 0, color: 'white', display: 'flex', alignItems: 'center', height: '100%' }}>
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
      <Tooltip ref={tooltipRef} visible={visibleTooltip} text={activeAction ? 'ajouter un restaurant' : '3 restaurants maximum'} color={'white'} />
    </div>
  )
}

export default Tabs

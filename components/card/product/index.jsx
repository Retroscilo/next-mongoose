/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useViewport } from '../../../lib/hooks/useViewport'
import ProductMobile from './Mobile'
import ProductDesktop from './Desktop'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Product = props => {
  const { width } = useViewport(); const mobile = width < 832
  const sortable = useSortable({ id: props.prodId })

  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} sx={{ position: 'relative', zIndex: 1000, ...style }}>
      <div sx={{ boxShadow: isDragging ? 'high' : '', transform: isDragging ? 'scale(1.02)' : '', transition: 'all .2s ease' }}>
        <div sx={{ position: 'absolute', right: '-50px', width: '50px', height: '50px', bg: 'gold' }} {...listeners} {...attributes} />
        {mobile && <ProductMobile {...props} />}
        {!mobile && <ProductDesktop {...props} />}
      </div>
    </div>
  )
}

export default Product

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useViewport } from '../../../lib/hooks/useViewport'
import ProductMobile from './Mobile'
import ProductDesktop from './Desktop'
import React from 'react'
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const Product = props => {
  const { width } = useViewport(); const mobile = width < 832
  const sortable = useSortable({id: props.prodId});

  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (mobile) return <ProductMobile {...props} />
  return <ProductDesktop ref={setNodeRef} style={style} attributes={attributes} listeners={listeners} isDragging={isDragging} {...props} />
}

export default Product

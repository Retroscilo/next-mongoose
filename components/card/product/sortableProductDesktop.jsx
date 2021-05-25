/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import { jsx } from 'theme-ui'

import ProductDesktop from './Desktop'

const SortableProduct = (props) => {
  const sortable = useSortable({id: props.infoSet._id});
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


  return (
    <div
    className={'test'}
      ref={setNodeRef}
      style={style}

      {...attributes}
      {...listeners}
      sx={{ background: 'gold', height: '200px', width: '200px' }}
      style={style}
    >{props.infoSet._id}</div>
  )
}

export default SortableProduct

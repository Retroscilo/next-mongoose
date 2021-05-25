import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import {Photo} from './Photo';

export const SortablePhoto = (props) => {
  const sortable = useSortable({id: props.url});
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = sortable;
  console.log(sortable)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log(style)
  return (
    <Photo
      activationConstraint={{
        delay: 250,
        tolerance: 5,
      }}
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

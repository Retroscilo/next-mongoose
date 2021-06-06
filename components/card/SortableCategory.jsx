/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableCategory = ({ children, ...props }) => {
  const sortable = useSortable({ id: props.id })
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
      <div {...attributes} {...listeners} sx={{ position: 'absolute', width: '10px', height: '10px', borderRadius: '100px', bg: 'lightgrey', top: '-80%', left: '50%' }} />
      {children}
    </div>
  )
}

export default SortableCategory

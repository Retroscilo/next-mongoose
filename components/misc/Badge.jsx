/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'

const Badge = ({ size, visible, options = {}, ...props }) => {
  return (
    <div
      sx={{
        position: 'relative',
        height: size,
        width: size,
        borderRadius: '100px',
        backgroundColor: options.color || 'accent',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        cursor: 'pointer',
        backgroundImage: options.background || 'url(/x.svg)',
        zIndex: 1,
        boxShadow: 'low',
        transition: 'transform .2s ease',
        transform: visible ? 'scale(1)' : 'scale(0)',
        '&:hover': { transform: 'scale(1.2)' },
        '&:active': { transform: 'scale(1)' },
        '&:active::before': { visibility: 'hidden' },
        '&::before': {
          width: '100px',
          content: `"${options.label || ''}"`,
          color: options.color || 'accent',
          position: 'absolute',
          opacity: 0,
          transition: 'all .1s ease',
          fontSize: 0,
          transform: 'translateY(10px)',
          textAlign: 'center',
          left: '-37px',
          top: '-70%',
          pointerEvents: 'none'
        },
        '&:hover::before': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }}
      {...props}
    />
  )
}

export default Badge

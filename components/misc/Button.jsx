/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'

const Button = ({ children, color = 'primary', ...props }) => (
  <button
    sx={{
      cursor: 'pointer',
      bg: 'transparent',
      border: 'none',
      fontSize: 3,
      px: 2,
      py: 2,
      mx: -2,
      color,
      '&:hover': {
        background: 'white',
        filter: 'brightness(90%)',
      },
    }}
    {...props}
  >{children}</button>
)

export default Button

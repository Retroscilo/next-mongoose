/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'

const Title = ({ children, color = 'white' }) => (
  <h1 sx={{ position: 'absolute', color, top: '-70px', fontWeight: 'normal' }}>{children}</h1>
)

const Card = ({ children, style }) => (
  <div
    sx={{
      position: 'relative',
      borderRadius: '3px',
      border: '1px solid #C8C8C8',
      boxShadow: '0px -7px 33px -19px rgb(60 84 146 / 28%), 10px -4px 33px -19px rgb(0 0 0 / 22%), -10px -4px 33px -19px rgb(0 0 0 / 22%)',
      bg: 'white',
      ...style
    }}
  >{children}</div>
)

Card.Title = Title

export default Card

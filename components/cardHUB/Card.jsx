/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'

const Card = ({ children }) => (
  <div
    sx={{
      position: 'relative',
      borderRadius: '3px',
      border: '1px solid #C8C8C8',
      boxShadow: '0px -7px 33px -19px rgb(60 84 146 / 28%), 10px -4px 33px -19px rgb(0 0 0 / 22%), -10px -4px 33px -19px rgb(0 0 0 / 22%)',
      bg: 'white',
    }}
  >{children}</div>
)

export default Card

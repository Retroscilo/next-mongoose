/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import styles from './Button.module.css'

const Arrow = () => (
  <div sx={{ display: 'flex', alignItems: 'center', transition: 'transform .2s ease' }}>
    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="24px" fill="#fff">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
    </svg>
  </div>
)

const Button = ({ children, color = 'primary', variant = 'ternary', ...props }) => (
  <button
    sx={{
      px: 2,
      pt: 2,
      pb: 2,
      mx: -2,
      color,
    }}
    className={ `${styles.default} ${styles[variant]}` }
    {...props}
  >{children}</button>
)

Button.Arrow = Arrow

export default Button

/* eslint-disable arrow-body-style */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import PropTypes from 'prop-types'

const Modal = ({ children }) => {
  return (
    <div
      sx={{
        width: '100vw',
        height: '100vh',
        bg: 'rgba(196, 196, 196, 0.5)',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: '0',
      }}
    >
      {children()}
    </div>
  )
}

export default Modal

Modal.propTypes = {
  children: PropTypes.func.isRequired,
}

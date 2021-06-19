import React from 'react'

const Label = ({ children }) => (
  <div
    style={{
      display: 'inline-block',
      marginRight: '6px',
      color: 'white',
      background: '#FF4D4D',
      width: '13px',
      height: '13px',
      borderRadius: '100px',
      textAlign: 'center',
      lineHeight: '13px',
      fontSize: '.7rem',
      zIndex: 1,
      paddingLeft: '.5px',
    }}
  >!{children}</div>
)

export { Label }
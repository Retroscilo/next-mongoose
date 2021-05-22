/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState } from 'react'
import propTypes from 'prop-types'

export default function Switch ({ isOn, label, size = 50, ...props }) {
  return (
    <div sx={{ display: 'flex', alignItems: 'center', pr: 2, color: isOn ? 'body' : 'textLight' }}>
      {label} &nbsp;
      <div
        { ...props }
        sx={{
          position: 'relative',
          width: `${size}px`,
          height: `${(size*2)/3.3}px`,
          paddingTop: `${(((size*2)/3.3) - (((size*2)/3)-10))/2}px`,
          borderRadius: '100px',
          display: 'flex',
          cursor: 'pointer',
          backgroundColor: isOn ? 'primary' : '#ddd',
          transition: 'background-color .2s ease',
        }}
      >
        <div
          sx={{
            position: 'absolute',
            width: `${((size*2)/3-10)}px`,
            height: `${((size*2)/3-10)}px`,
            backgroundColor: '#ffffff',
            borderRadius: '200px',
            boxShadow: '1px 2px 3px rgba(0, 0, 0, 0.02)',
            left: isOn ? `calc(100% - ${size/2}px)` : '5px',
            transition: 'left .3s ease',
          }}
        />
      </div>
    </div>
  )
}

Switch.propTypes = {
  isOn: propTypes.bool,
  label: propTypes.string,
}

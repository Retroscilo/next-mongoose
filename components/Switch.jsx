/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState } from 'react'
import propTypes from 'prop-types'

export default function Switch ({ isOn, label, ...props }) {
  return (
    <div sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
      {label} &nbsp;
      <div
        { ...props }
        sx={{
          position: 'relative',
          width: '50px',
          height: '30px',
          paddingTop: '5px',
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
            width: '20px',
            height: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '200px',
            boxShadow: '1px 2px 3px rgba(0, 0, 0, 0.02)',
            left: isOn ? 'calc(100% - 25px)' : '5px',
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

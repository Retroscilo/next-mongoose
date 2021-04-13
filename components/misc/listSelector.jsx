/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef } from 'react'
import { useClickOutside } from '../../lib/hooks/useClickOutside'

const ListSelector = ({ options, label }) => {
  console.log('listSelector')
  return (
    <div sx={{ position: 'relative' }}>
      {label}
      <div className={'optionList'} sx={{ boxShadow: 'low' }}>{options.map(option => <div>{option.catName}</div>)}</div>
      <style jsx>{`
        .optionList 
          opacity: 0
          position: absolute
          background: white
          borderRadius: 3px
        
      `}</style>
    </div>
  )
}

export default ListSelector

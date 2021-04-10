/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef } from 'react'
import { useClickOutside } from '../lib/hooks/useClickOutside'

const SelectIcons = ({ icons, options = {} }) => {
  const O = { iconSize: '10px', width: '200px', ...options }
  const defaultIcon = icons.filter(icon => options.defaultColor === icon.value)
  const [ selected, setSelected ] = useState(defaultIcon[0])
  const [ displaySelectBox, setDisplaySelectBox ] = useState(false)
  const selectBox = useRef(null)
  const toggleSelectBox = () => setDisplaySelectBox(!displaySelectBox)
  useClickOutside(selectBox, () => setDisplaySelectBox(false))
  const handleSelect = icon => {
    setSelected(icon)
    options.callback(icon.value)
    toggleSelectBox()
  }

  return (
    <div sx={{ position: 'relative' }} ref={selectBox}>
      <div
        onClick={toggleSelectBox}
        sx={{ background: `url(${selected.url})`, width: O.iconSize, height: O.iconSize, backgroundSize: 'cover', border: '1px solid lightgrey', borderRadius: '100px', cursor: 'pointer' }}
      />
      <div 
        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', width: O.width, bg: 'white', borderRadius: '100px', boxShadow: 'low', my: 2, pl: 3, pb: 2, position: 'absolute', opacity: displaySelectBox ? 1 : 0, transform: displaySelectBox ? 'translate(-45%, 0)' : 'translate(-45%, -10px)', transition: 'all 0.3s ease' }}
      >
        {icons.map((icon, i) => 
        <span
          key={i}
          onClick={() => handleSelect(icon)} 
          sx={{ background: `url(${icon.url})`, width: O.iconSize, height: O.iconSize, backgroundSize: 'cover', border: '1px solid lightgrey', borderRadius: '100px', mr: 3, mt: 2, cursor: 'pointer' }}
        />)}
      </div>
    </div>
  )
}

export default SelectIcons
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useRef } from 'react'
import { useClickOutside } from '../../lib/hooks/useClickOutside'

const SelectIcons = ({ icons, options = {} }) => {
  const O = { iconSize: '10px', width: '200px', stroke: true, round: true, ...options }
  const defaultIcon = icons.filter(icon => O.default === icon.value)
  const [ selected, setSelected ] = useState(defaultIcon[0] || O.default)

  const [ displaySelectBox, setDisplaySelectBox ] = useState(false)
  const selectBox = useRef(null)
  const toggleSelectBox = () => setDisplaySelectBox(!displaySelectBox)
  useClickOutside(selectBox, () => setDisplaySelectBox(false))

  const handleSelect = icon => {
    if (!O.keepDefault) setSelected(icon)
    options.callback(icon.value)
    if (!O.closeOnClick) toggleSelectBox()
  }

  return (
    <div sx={{ position: 'relative' }} ref={selectBox}>
      <div
        onClick={toggleSelectBox}
        sx={{ background: `url(${selected.url}) no-repeat`, width: O.iconSize, height: O.iconSize, backgroundSize: 'contain', border: O.stroke ? '1px solid lightgrey' : '', borderRadius: O.round ?'100px' : 0, cursor: 'pointer' }}
      />
      <div 
        sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: O.column ? 'column' : 'row', width: O.width, bg: 'white', borderRadius: '100px', boxShadow: 'low', my: 2, pl: '25px', pb: 2, position: 'absolute', opacity: displaySelectBox ? 1 : 0, transform: displaySelectBox ? 'translate(-45%, 0)' : 'translate(-45%, -10px)', transition: 'all .2s ease', pointerEvents: displaySelectBox ? 'initial' : 'none' }}
      >
        {icons.map((icon, i) => 
        <span
          key={i}
          onClick={() => handleSelect(icon)} 
          sx={{ background: `url(${icon.url}) no-repeat`, width: O.iconSize, height: O.iconSize, backgroundSize: 'contain', border: O.stroke ? '1px solid lightgrey' : '', borderRadius: O.round ? '100px' : 0, mr: 3, mt: 2, cursor: 'pointer' }}
        />)}
      </div>
    </div>
  )
}

export default SelectIcons
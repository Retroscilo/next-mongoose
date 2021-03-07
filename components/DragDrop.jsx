/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect, useRef } from 'react'
import { uploadPhoto } from '../lib/connectAws'
import { motion } from 'framer-motion'
import theme from '../theme'

const DragDrop = ({ infoSet, update }) => {
  const { cardId, prodId, imgSrc } = infoSet
  const [ hash, setHash ] = useState(Date.now()) // force image reload 
  const dropRef = useRef(null)
  const inputRef = useRef(null)
  const [ fillColor, setFillColor ] = useState('black')

  useEffect(() => {
    const div = dropRef.current

    function handleDragIn (e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.srcElement !== div) return
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setFillColor(theme.colors.primary)
    }

    function handleDragOut (e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.path[0] !== div || div.contains(e.relatedTarget)) return
      setFillColor('black')
    }

    function handleDrag (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    async function handleDrop (e) {
      e.preventDefault()
      e.stopPropagation()
      setFillColor(theme.colors.primary)
      uploadAndRefresh(e.dataTransfer.files)
    }

    div.addEventListener('dragenter', handleDragIn)
    div.addEventListener('dragleave', handleDragOut, { bubbles: false })
    div.addEventListener('dragover', handleDrag)
    div.addEventListener('drop', handleDrop)

    return () => {
      div.removeEventListener('dragenter', handleDragIn)
      div.removeEventListener('dragleave', handleDragOut)
      div.removeEventListener('dragover', handleDrag)
      div.removeEventListener('drop', handleDrop)
    }
  })

  const uploadAndRefresh = async (fileSet) => {
    if(fileSet && fileSet.length > 0) {
      const file = fileSet[0]
      const filename = prodId + file.type.replace('image/', '.')
      try {
        const url = await uploadPhoto(cardId, filename, file)
        setHash(Date.now())
        update('photo', url)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const onClickHandler = (e) => {
    inputRef.current.click()
  }

  const handleChange = async e => {
    e.preventDefault()
    e.stopPropagation()
    uploadAndRefresh(e.target.files)
  }

  return (
    <motion.div 
      ref={dropRef} 
      sx={{ width: '70px', height: '70px', position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
      onClick={onClickHandler} 
      onHoverStart={() => setFillColor(theme.colors.primary)}
      onHoverEnd={() => setFillColor('black')}>
      {!imgSrc && 
        <svg 
          width="50" 
          height="50" 
          viewBox="0 0 72 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path sx={{ transition: 'fill 0.2s', fill: fillColor }} d="M26 0L21 10H7C3.122 10 0 13.122 0 17V53C0 56.878 3.122 60 7 60H65C68.878 60 72 56.878 72 53V17C72 13.122 68.878 10 65 10H51L46 0H26V0ZM36 18C45.3533 18 53 25.6467 53 35C53 44.3533 45.3533 52 36 52C26.6468 52 19 44.3533 19 35C19 25.6467 26.6468 18 36 18V18ZM36 24C29.8896 24 25 28.8894 25 35C25 41.1106 29.8896 46 36 46C42.1107 46 47 41.1106 47 35C47 28.8894 42.1107 24 36 24Z" />
        </svg>
      }
      {imgSrc && 
        <div sx={{ width: '100%', height: '100%', background: `url('${imgSrc+'?'+hash}') no-repeat center`, backgroundSize: 'cover' }}></div>
      }
      <input ref={inputRef} type="file" accept="image/jpeg, image/png, image/gif, image/heic, image/heif, image/tiff, image/webp" autoComplete="off" sx={{ display: 'none' }} onChange={handleChange} />
    </motion.div>
  )
}

export default DragDrop

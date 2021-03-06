/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect, useRef, useReducer } from 'react'
import theme from '../theme'
import AddPhoto from './svg/addPhoto'
import { createAlbum, uploadPhoto, viewAlbum } from '../lib/connectAws'

const DragDrop = ({ infoSet, update }) => {
  const { cardId, prodId, imgSrc } = infoSet
  const [ dragging, setDragging ] = useState(false)
  const [ hash, setHash ] = useState(Date.now()) // force image reload 
  const dropRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const div = dropRef.current

    function handleDragIn (e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.srcElement !== div) return
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setDragging(true)
    }

    function handleDragOut (e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.path[0] !== div || div.contains(e.relatedTarget)) return
      setDragging(false)
    }

    function handleDrag (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    async function handleDrop (e) {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)
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
    <div ref={dropRef} sx={{ width: theme.Product.height, height: '100%', position: 'absolute', right: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', '&:hover': { cursor: 'pointer' } }} onClick={onClickHandler}>
      {!imgSrc && 
        <AddPhoto hover={dragging} psx={{ width: '60px', height: '40px' }} />
      }
      {imgSrc && 
        <div sx={{ width: '100%', height: '100%', background: `url('${imgSrc+'?'+hash}') no-repeat center`, backgroundSize: 'cover' }}></div>
      }
      <input ref={inputRef} type="file" accept="image/jpeg, image/png, image/gif, image/heic, image/heif, image/tiff, image/webp" autoComplete="off" sx={{ display: 'none' }} onChange={handleChange} />
    </div>
  )
}

export default DragDrop

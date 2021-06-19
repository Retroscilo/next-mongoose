/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { forwardRef } from 'react'

const FileInput = forwardRef(({ ...props }, ref) => {
  return (
    <input ref={ref} type="file" accept="image/jpeg, image/png, image/gif, image/heic, image/heif, image/tiff, image/webp" autoComplete="off" style={{ display: 'none' }} {...props} />
  )
})

export { FileInput }

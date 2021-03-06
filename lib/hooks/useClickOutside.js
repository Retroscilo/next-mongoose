/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react'

export function useClickOutside (ref, callback) {
  useEffect(() => {
    function handleClickOutside (event) {
      if (!ref.current?.contains(event.target)) callback()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ ref ])
}

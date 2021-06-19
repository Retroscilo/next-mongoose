const preventChariot = e => {
  if (e.key === 'Enter') {
    e.preventDefault()
    return false
  }
  return true
}

export { preventChariot }

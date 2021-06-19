const preventChariot = e => {
  if (e.key === 'Enter') e.target.blur()
}

export { preventChariot }

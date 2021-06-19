const empty = e => {
  if (!(e.target.innerText.length - 1) === 0) return false
  return true
}

export { empty }

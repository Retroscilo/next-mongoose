import { useState } from 'react'
import { motion } from 'framer-motion'

export const LabelSelector = ({ labels, client, cardId, prodId, catId }) => {
  const allLabels = [ 'homeMade', 'spicy', 'vegan', 'glutenFree' ]
  const [ selectedLabels, setSelectedLabels ] = useState(allLabels.filter(label => labels.includes(label)))
  const handleClick = async label => {
    if (client) return
    let newLabels;
    if (!selectedLabels.includes(label)) newLabels = [ ...selectedLabels, label ]
    else newLabels = selectedLabels.filter(l => l !== label)
    setSelectedLabels(newLabels)
    try {
      await fetchJson('/api/card/product', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cardId, prodId, catId, newLabels })
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <motion.ul sx={{ gridArea: 'label', width: 'fit-content', justifySelf: 'end', pr: 3, display: 'flex' }} transition={{ type: 'ease' }} >
      {allLabels.map(label => 
        <motion.li key={label}
          sx={{
            background: `url(/productLabels/${label}.svg) no-repeat`,
            width: client && !selectedLabels.includes(label) ? '0' : '25px',
            height: '25px',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            mr: client && !selectedLabels.includes(label) ? 0 : 2,
            opacity: !selectedLabels.includes(label) ? .3 : 1,
            cursor: 'pointer',
            transition: 'opacity .3s'
          }}
          onClick={() => handleClick(label)}
        />)}
    </motion.ul>
  )
}

export default LabelSelector

/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../lib/hooks/useTheme'
import fetchJson from '../../../lib/fetchJson'
import * as Labels from '../../../public/productLabels/index'

export const LabelSelector = ({ labels, client, cardId, prodId, catId, mobile }) => {
  const [ selectedLabels, setSelectedLabels ] = useState(labels)
  const theme = useTheme()

  const handleClick = async label => {
    if (client) return
    let newLabels
    if (!selectedLabels.includes(label)) newLabels = [ ...selectedLabels, label ]
    else newLabels = selectedLabels.filter(l => l !== label)
    setSelectedLabels(newLabels)
    try {
      await fetchJson('/api/card/product', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cardId, prodId, catId, newLabels }),
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <motion.ul sx={{ gridArea: 'label', width: 'fit-content', justifySelf: 'end', p: 0, m: 0, display: 'flex', flexWrap: 'wrap' }} transition={{ type: 'ease' }} >
      {Object.entries(Labels).map(label => {
        const Label = label[1]
        const labelName = label[1].name
        if (!selectedLabels.includes(labelName) && client) return
        return (
          <motion.li
            key={label}
            sx={{
              mx: client && !selectedLabels.includes(label) ? 0 : 1,
              opacity: !selectedLabels.includes(labelName) ? 0.8 : 1,
              cursor: 'pointer',
              transition: 'all .3s',
            }}
            onClick={() => handleClick(labelName)}
          >
            <Label fillColor={selectedLabels.includes(labelName) ? theme.colors.highlight : 'lightgrey'} size={mobile ? 20 : 25} />
          </motion.li>
        )
      })}
    </motion.ul>
  )
}

export default LabelSelector

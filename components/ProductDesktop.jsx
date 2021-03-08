/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRef } from 'react'
import PropTypes from 'prop-types'
import Input from '../components/Input'
import fetchJson from '../lib/fetchJson'
import DragDrop from '../components/DragDrop'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'

const ProductDesktop = ({ cardId, catId, infoSet, refresh }) => {
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc } = infoSet

  const updateProduct = async (field, value) => {
    const body = { cardId, catId, prodId, field, value }
    await fetchJson('/api/product', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  const deleteProduct = async () => {
    await fetchJson('/api/product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, catId, prodId }),
    })
    await refresh()
  }

  return (
    <motion.div // WRAPPER
      sx={{ variant: 'Product.desktop', position: 'relative', overflow: 'hidden' }}
      initial={{ transform: 'scale(0)' }}
      animate={{ transform: 'scale(1)' }}
    >
      <motion.div // DELETE
        sx={{ height: '100px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0', backgroundColor: 'accent', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', cursor: 'pointer', backgroundImage: 'url(/dustbin.svg)', zIndex: 1 }}
        onClick={deleteProduct}
      />
      <Input
        defaultValue={prodName}
        update={updateProduct}
        variant="regular"
        field={'prodName'}
      />
      <Input
        defaultValue={prodDescription}
        update={updateProduct}
        variant="light"
        field={'prodDescription'}
      />
      <Input
        defaultValue={prodPrice}
        update={updateProduct}
        variant="light"
        field={'prodPrice'}
      />
      <DragDrop
        infoSet={{ imgSrc, cardId, prodId }}
        update={updateProduct}
        variant="Product.photo"
      />
    </motion.div>
  )
}

export default ProductDesktop

ProductDesktop.propTypes = {
  cardId: PropTypes.string,
  catId: PropTypes.string,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

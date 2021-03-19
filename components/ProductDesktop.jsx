/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Input from '../components/Input'
import fetchJson from '../lib/fetchJson'
import DragDrop from '../components/DragDrop'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'

const ProductDesktop = ({ cardId, catId, infoSet, refresh, index }) => {
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc } = infoSet
  const [ order, setOrder ] = useState(index)
  useEffect(() => setOrder(index), [ index ])
  const [ isHover, setIsHover ] = useState(false)

  const updateProduct = async (field, value) => {
    const body = { cardId, catId, prodId, field, value }
    try {
      const res = await fetchJson('/api/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await refresh()
      return res
    } catch (e) {
      throw new Error(e.data)
    }
  }

  const deleteProduct = async () => {
    await fetchJson('/api/product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, catId, prodId }),
    })
    setIsHover(false)
    await refresh()
  }

  return (
    <motion.div
      sx={{
        variant: 'Product.desktop',
        position: 'relative',
        overflow: 'initial',
        transform: 'scale(1)',
        display: 'grid',
        gridTemplateColumns: '90px calc(100% - 188px) 84px',
        gridTemplateRows: '1fr 1fr 1fr',
        alignItems: 'center',
        gridTemplateAreas: '"prodName prodName photo" "prodDescription prodDescription photo" "prodPrice empty photo"',
        maxWidth: '550px',
        order,
      }}
      initial={{ transform: 'scale(0)' }}
      animate={'visible'}
      exit={'deleted'}
      variants={{
        visible: { transform: 'scale(1)' },
        deleted: { opacity: 0, transform: 'scale(0)' },
      }}
      transition={{ opacity: { duration: 0.2 } }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <motion.div // DELETE
        sx={{ height: '25px', width: '25px', borderRadius: '100px', position: 'absolute', top: '-10px', left: '-10px', backgroundColor: 'accent', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', cursor: 'pointer', backgroundImage: 'url(/x.svg)', zIndex: 1, boxShadow: 'low' }}
        variants={{
          hidden: { scale: 0 },
          visible: { scale: 1 },
        }}
        animate={ isHover ? 'visible' : 'hidden' }
        onClick={deleteProduct}
      />
      <Input
        defaultValue={prodName}
        update={updateProduct}
        variant="regular"
        field={'prodName'}
        options={{
          max: 30,
          empty: {
            prevent: true,
            err: 'Vous devez choisir un nom pour votre produit !',
          },
        }}
      />
      <Input
        defaultValue={prodDescription}
        update={updateProduct}
        variant="light"
        field={'prodDescription'}
        options={{ max: 80 }}
      />
      <Input
        defaultValue={prodPrice}
        update={updateProduct}
        variant="light"
        field={'prodPrice'}
        options={{
          max: 6,
          inputMatch: /[^0-9.,]/,
          empty: {
            prevent: true,
            err: 'Vous devez entrer un prix pour votre produit !',
          },
          label: '€',
        }}
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
  order: PropTypes.number,
  refresh: PropTypes.func,
}

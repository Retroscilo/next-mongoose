/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import { jsx } from 'theme-ui'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import fetchJson from '../../../lib/fetchJson'
import { motion } from 'framer-motion'
// Components
import Input from '../../Input'
import DragDrop from '../DragDrop'
import LabelSelector from './LabelSelector'
import { useTheme } from '../../../lib/hooks/useTheme'

const ProductDesktop = props => {
  const { client, cardId, catId, infoSet, refresh, index } = props
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc, labels } = infoSet
  const [ order, setOrder ] = useState(index)
  useEffect(() => setOrder(index), [ index ])
  const [ isHover, setIsHover ] = useState(false)
  const theme = useTheme()

  const updateProduct = async (field, value) => {
    const body = { cardId, catId, prodId, field, value }
    try {
      const res = await fetchJson('/api/card/product', {
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
    await fetchJson('/api/card/product', {
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
        position: 'relative',
        variant: 'Product.desktop',
        bg: theme.product.background.desktop,
        overflow: 'initial',
        transform: 'scale(1)',
        display: 'grid',
        alignItems: 'center',
        ...theme.product.layout.desktop,
        maxWidth: theme.category.layout.desktop === '1fr' ? '' : '550px',
        order,
        zIndex: 599 - order,
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
      {!client && <motion.div // DELETE
        sx={{ height: '25px', width: '25px', borderRadius: '100px', position: 'absolute', top: '-10px', left: '-10px', backgroundColor: 'accent', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', cursor: 'pointer', backgroundImage: 'url(/x.svg)', zIndex: 1, boxShadow: 'low' }}
        variants={{
          hidden: { scale: 0 },
          visible: { scale: 1 },
        }}
        initial={'hidden'}
        animate={ isHover ? 'visible' : 'hidden' }
        onClick={deleteProduct}
      />}
      <Input
        client={client}
        defaultValue={prodName}
        update={updateProduct}
        variant="headSmall"
        field={'prodName'}
        options={{
          max: 30,
          empty: {
            prevent: true,
            err: 'Vous devez choisir un nom pour votre produit !',
          },
          gridArea: 'prodName',
          maxWidth: '40rem',
        }}
      />
      <Input
        client={client}
        defaultValue={prodDescription}
        update={updateProduct}
        variant="body"
        field={'prodDescription'}
        options={{ max: 140, gridArea: 'prodDescription', maxHeight: '62px', maxWidth: '95%' }}
      />
      <Input
        client={client}
        defaultValue={prodPrice}
        update={updateProduct}
        variant="highlight"
        field={'prodPrice'}
        options={{
          justifyContent: 'flex-end',
          max: 6,
          inputMatch: /[^0-9.,]/,
          empty: {
            prevent: true,
            err: 'Vous devez entrer un prix pour votre produit !',
          },
          label: '€',
          gridArea: 'prodPrice',
          spinner: { left: '-15px' },
        }}
      />
      <LabelSelector
        labels={labels} refresh={updateProduct}
        client={client} prodId={prodId}
        cardId={cardId} catId={catId}
      />
      <DragDrop
        client={client}
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
  client: PropTypes.bool,
  index: PropTypes.number,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

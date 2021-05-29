/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import { jsx, Spinner } from 'theme-ui'
import { useState, useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
// Components
import Input from '../../Input'
import DragDrop from '../DragDrop'
import LabelSelector from './LabelSelector'
import { useTheme } from '../../../lib/hooks/useTheme'
import Badge from '../../misc/Badge'
import { useCard } from '../../../lib/hooks/useCard'

const ProductDesktop = ({ client, catId, prodId }) => {
  const { card, useProduct } = useCard()
  const cardId = card._id
  const product = useProduct(catId, prodId)
  const { prodName, prodDescription, prodPrice, photo: imgSrc, labels } = product
  const [ isHover, setIsHover ] = useState(false)
  const { theme } = useTheme()
  if (!product) return
  return (
    <motion.div
      sx={{
        position: 'relative',
        transition: 'box-shadow .3s ease',
        variant: 'Product.desktop',
        bg: theme.product.background.desktop,
        overflow: 'initial',
        display: 'grid',
        alignItems: 'center',
        ...theme.product.layout.desktop,
        maxWidth: theme.category.layout.desktop === '1fr' ? '' : '550px',
      }}
      transition={{ opacity: { duration: 0.2 } }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      {!client &&
        <nav sx={{ position: 'absolute', top: '-10px', left: '-10px', display: 'flex', '& > *': { mr: 2 } }}>
          <Badge size={25} visible={isHover} onClick={product.delete} options={{ label: 'supprimer' }} />
        </nav>
      }
      <Input
        client={client}
        defaultValue={prodName}
        update={product.update}
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
        update={product.update}
        variant="body"
        field={'prodDescription'}
        options={{ max: 140, gridArea: 'prodDescription', maxHeight: '62px', maxWidth: '95%' }}
      />
      <Input
        client={client}
        defaultValue={prodPrice}
        update={product.update}
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
        labels={labels} refresh={product.update}
        client={client} prodId={prodId}
        cardId={cardId} catId={catId}
      />
      <DragDrop
        client={client}
        infoSet={{ imgSrc, cardId, prodId }}
        update={product.update}
        variant="Product.photo"
      />
    </motion.div>
  )
}

export default ProductDesktop

ProductDesktop.propTypes = {
  catId: PropTypes.string,
  client: PropTypes.bool,
  index: PropTypes.number,
}

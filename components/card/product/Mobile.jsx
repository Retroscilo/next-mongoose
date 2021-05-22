/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import { jsx } from 'theme-ui'
import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import fetchJson from '../../../lib/fetchJson'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
// Hooks
import { useClickOutside } from '../../../lib/hooks/useClickOutside'
import { useTheme } from '../../../lib/hooks/useTheme'
import { useViewport } from '../../../lib/hooks/useViewport'
// Components
import Input from '../../Input'
import DragDrop from '../DragDrop'
import LabelSelector from './LabelSelector'

const ProductMobile = props => {
  const theme = useTheme()
  const { width: viewportWidth } = useViewport()
  const { client, cardId, catId, infoSet, refresh, index } = props
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc, labels } = infoSet
  const productRef = useRef(null) // used for clicked outside
  const animationPadding = useRef(null)
  const controls = useAnimation() // hidden * visible * deleting
  const [ order, setOrder ] = useState(index)
  useEffect(() => setOrder(index), [ index ])

  function onDragEnd (e, info) { // auto close or discover delete button /!\ refine to be more accurate than just velocity
    const shouldClose = info.velocity.x > 0
    if (shouldClose) controls.start('hidden')
    else controls.start('visible')
  }

  useClickOutside(productRef, () => controls.start('hidden')) // close drag when clicked outside focused product

  const updateProduct = async (field, value) => {
    const body = { cardId, catId, prodId, field, value }
    const res = await fetchJson('/api/card/product', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
    return res
  }

  const deleteProduct = async () => {
    animationPadding.current.style.padding = 0 // issue with framer not animating padding
    try {
      await fetchJson('/api/card/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, catId, prodId }),
      })
      await controls.start('deleting')
      await refresh()
    } catch (e) {
      console.log(e)
    }
  }

  const x = useMotionValue(0)
  const xInput = [ -1000, 0 ]
  const width = useTransform(x, xInput, [ 1000, 0 ])
  const height = useTransform(x, [ -1000, -75, 0 ], [ 0, '100%', 120 ]) // height of delete button across deleting animation

  return (
    <motion.div // WRAPPER
      sx={{ position: 'relative', order, mt: 4 }}
      ref={productRef}
      initial={{ height: 0 }}
      animate={{ height: 'fit-content' }}
    >
      <motion.div // DELETE
        style={{ width, height }}
        sx={{ height: '100%', position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0', backgroundColor: 'accent', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', cursor: 'pointer', backgroundImage: 'url(/dustbin.svg)', zIndex: 1 }}
        onClick={deleteProduct}
      />
      <motion.div // PRODUCT ELEMENT
        sx={{
          height: 'fit-content',
          bg: '#fff',
          padding: 2,
          position: 'relative',
          zIndex: 999 - order,
          display: 'grid',
          alignItems: 'center',
          ...theme.product.layout[viewportWidth < 450 ? 'XS' : 'mobile'],
        }}
        ref={animationPadding}
        drag={client ? '' : 'x'}
        initial="hidden"
        variants={{
          hidden: { x: 0, height: 'fit-content' },
          visible: { x: -75, height: 'fit-content' },
          deleting: { x: -1000, height: 0 },
        }}
        transition={{ x: { duration: 0.2 }, height: { duration: 0.2 } }}
        animate={controls}
        style={{ x }}
        dragElastic={0.01}
        dragConstraints={{ left: -75, right: 0 }}
        dragTransition={{ min: -75, max: 0, restDelta: 10, bounceStiffness: 10 }}
        onDragEnd={onDragEnd}
      >
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
            maxHeight: '95px',
          }}
        />
        <Input
          client={client}
          defaultValue={prodDescription}
          update={updateProduct}
          variant="body"
          field={'prodDescription'}
          options={{ max: 140, gridArea: 'prodDescription', maxHeight: '95px', maxWidth: '95%' }}
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
          mobile
        />
        <DragDrop
          client={client}
          infoSet={{ imgSrc, cardId, prodId }}
          update={updateProduct}
          variant="Product.photo"
        />
      </motion.div>
    </motion.div>
  )
}

export default ProductMobile

ProductMobile.propTypes = {
  cardId: PropTypes.string,
  catId: PropTypes.string,
  client: PropTypes.bool,
  index: PropTypes.number,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

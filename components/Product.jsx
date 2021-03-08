/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useRef } from 'react'
import PropTypes from 'prop-types'
import Input from '../components/Input'
import fetchJson from '../lib/fetchJson'
import DragDrop from '../components/DragDrop'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { useClickOutside } from '../lib/hooks/useClickOutside'

const Product = ({ cardId, catId, infoSet, refresh }) => {
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc } = infoSet
  const productRef = useRef(null) // used for clicked outside
  const animationPadding = useRef(null)
  const controls = useAnimation() // hidden * visible * deleting

  function onDragEnd (e, info) { // auto close or discover delete button /!\ refine to be more accurate than just velocity
    const shouldClose = info.velocity.x > 0
    if (shouldClose) controls.start('hidden')
    else controls.start('visible')
  }

  useClickOutside(productRef, () => controls.start('hidden')) // close drag when clicked outside focused product

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
    animationPadding.current.style.padding = 0 // issue with framer not animating padding
    await fetchJson('/api/product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, catId, prodId }),
    })
    await controls.start('deleting')
    await refresh()
  }

  const x = useMotionValue(0)
  const xInput = [ -1000, 0 ]
  const width = useTransform(x, xInput, [ 1000, 0 ])
  const height = useTransform(x, [ -1000, -75, 0 ], [ 0, 100, 100 ]) // height of delete button across deleting animation

  return (
    <motion.div // WRAPPER
      sx={{ position: 'relative', overflow: 'hidden' }}
      ref={productRef}
      initial={{ height: 0 }}
      animate={{ height: 'fit-content' }}
    >
      <motion.div // DELETE
        style={{ width, height }}
        sx={{ height: '100px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0', backgroundColor: 'accent', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', cursor: 'pointer', backgroundImage: 'url(/dustbin.svg)', zIndex: 1 }}
        onClick={deleteProduct}
      />
      <motion.div // PRODUCT ELEMENT
        sx={{ variant: 'Product.mobile', position: 'relative', zIndex: 2 }}
        ref={animationPadding}
        drag={'x'}
        initial="hidden"
        variants={{
          hidden: { x: 0, height: 100 },
          visible: { x: -75, height: 100 },
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
    </motion.div>
  )
}

export default Product

Product.propTypes = {
  cardId: PropTypes.string,
  catId: PropTypes.string,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

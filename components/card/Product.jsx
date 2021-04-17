/** @jsxRuntime classic */
/** @jsx jsx */
// Front
import { jsx } from 'theme-ui'
import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import fetchJson from '../../lib/fetchJson'
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion'
// Hooks
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import { useViewport } from '../../lib/hooks/useViewport'
// Components
import Input from '../Input'
import DragDrop from '../DragDrop'
import { IconSelector } from '../misc/index'


const Product = ({ client, cardId, catId, infoSet, refresh, index }) => {
  const { width } = useViewport(); const mobile = width < 832

  if (mobile) return <ProductMobile client={client} cardId={cardId} catId={catId} infoSet={infoSet} refresh={refresh} index={index} />
  return <ProductDesktop client={client} cardId={cardId} catId={catId} infoSet={infoSet} refresh={refresh} index={index} />
}

export default Product

const LabelSelector = ({ labels, refresh, client, cardId, prodId, catId }) => {
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
    refresh()
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

const Inputs = props => (
  <>
    <Input
      client={props.client}
      defaultValue={props.prodName}
      update={props.updateProduct}
      variant="regular"
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
      client={props.client}
      defaultValue={props.prodDescription}
      update={props.updateProduct}
      variant="light"
      field={'prodDescription'}
      options={{ max: 140, gridArea: 'prodDescription', maxHeight: '62px', maxWidth: '40rem' }}
    />
    <Input
      client={props.client}
      defaultValue={props.prodPrice}
      update={props.updateProduct}
      variant="regular"
      field={'prodPrice'}
      options={{
        max: 6,
        inputMatch: /[^0-9.,]/,
        empty: {
          prevent: true,
          err: 'Vous devez entrer un prix pour votre produit !',
        },
        label: '€',
        gridArea: 'prodPrice',
      }}
    />
    <LabelSelector labels={props.labels} refresh={props.updateProduct} client={props.client} prodId={props.prodId} cardId={props.cardId} catId={props.catId} />
    <DragDrop
      client={props.client}
      infoSet={{ imgSrc: props.imgSrc, cardId: props.cardId, prodId: props.prodId }}
      update={props.updateProduct}
      variant="Product.photo"
    />
  </>
)

const ProductDesktop = ({ client, cardId, catId, infoSet, refresh, index }) => {
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc, labels } = infoSet
  const [ order, setOrder ] = useState(index)
  useEffect(() => setOrder(index), [ index ])
  const [ isHover, setIsHover ] = useState(false)

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
        overflow: 'initial',
        transform: 'scale(1)',
        display: 'grid',
        gridTemplateColumns: '90px calc(100% - 188px) 84px',
        gridTemplateRows: '1fr 1fr 1fr',
        alignItems: 'center',
        gridTemplateAreas: '"prodName prodName photo" "prodDescription prodDescription photo" "prodPrice label photo"',
        maxWidth: '550px',
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
      <Inputs
        client={client}
        prodId={prodId}
        prodName={prodName}
        prodDescription={prodDescription}
        prodPrice={prodPrice}
        imgSrc={imgSrc}
        cardId={cardId}
        updateProduct={updateProduct}
        labels={labels}
        catId={catId}
      />
    </motion.div>
  )
}

const ProductMobile = ({ client, cardId, catId, infoSet, refresh, index }) => {
  const { _id: prodId, prodName, prodDescription, prodPrice, photo: imgSrc, labels } = infoSet
  const productRef = useRef(null) // used for clicked outside
  const animationPadding = useRef(null)
  const controls = useAnimation() // hidden * visible * deleting
  const [ order, setOrder ] = useState(index)
  useEffect(() => setOrder(index), [ index ])

  const [ deleting, setDeleting ] = useState(false)

  function onDragEnd (e, info) { // auto close or discover delete button /!\ refine to be more accurate than just velocity
    const shouldClose = info.velocity.x > 0
    if (shouldClose) controls.start('hidden')
    else controls.start('visible')
  }

  useClickOutside(productRef, () => !deleting && controls.start('hidden')) // close drag when clicked outside focused product

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
    setDeleting(true)
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
    } finally {
      setDeleting(false)
    }
    
  }

  const x = useMotionValue(0)
  const xInput = [ -1000, 0 ]
  const width = useTransform(x, xInput, [ 1000, 0 ])
  const height = useTransform(x, [ -1000, -75, 0 ], [ 0, 120, 120 ]) // height of delete button across deleting animation

  return (
    <motion.div // WRAPPER
      sx={{ position: 'relative', order }}
      ref={productRef}
      initial={{ height: 0 }}
      animate={{ height: 'fit-content' }}
    >
      <motion.div // DELETE
        style={{ width, height }}
        sx={{ height: '120px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '0', backgroundColor: 'accent', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', cursor: 'pointer', backgroundImage: 'url(/dustbin.svg)', zIndex: 1 }}
        onClick={deleteProduct}
      />
      <motion.div // PRODUCT ELEMENT
        sx={{
          variant: 'Product.mobile',
          position: 'relative',
          zIndex: 999 - order,
          display: 'grid',
          gridTemplateColumns: '50px calc(100% - 134px) 84px',
          gridTemplateRows: '1fr 1fr 1fr',
          alignItems: 'center',
          gridTemplateAreas: '"prodName prodName photo" "prodDescription prodDescription photo" "prodPrice label photo"',
        }}
        ref={animationPadding}
        drag={'x'}
        initial="hidden"
        variants={{
          hidden: { x: 0, height: 120 },
          visible: { x: -75, height: 120 },
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
        <Inputs
          prodId={prodId}
          client={client}
          prodName={prodName}
          prodDescription={prodDescription}
          prodPrice={prodPrice}
          imgSrc={imgSrc}
          cardId={cardId}
          updateProduct={updateProduct}
          labels={labels}
          catId={catId}
        />
      </motion.div>
    </motion.div>
  )
}

ProductDesktop.propTypes = {
  cardId: PropTypes.string,
  catId: PropTypes.string,
  client: PropTypes.bool,
  index: PropTypes.number,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

ProductMobile.propTypes = {
  cardId: PropTypes.string,
  catId: PropTypes.string,
  client: PropTypes.bool,
  index: PropTypes.number,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

Product.propTypes = {
  cardId: PropTypes.string,
  catId: PropTypes.string,
  client: PropTypes.bool,
  index: PropTypes.number,
  infoSet: PropTypes.object,
  refresh: PropTypes.func,
}

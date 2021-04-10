/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Components
import ProductMobile from './ProductMobile'
import ProductDesktop from './ProductDesktop'
import Input from '../Input'
// Front
import PropTypes from 'prop-types'
import fetchJson from '../../lib/fetchJson'
import { jsx } from 'theme-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
// Hooks
import { useViewport } from '../../lib/hooks/useViewport'
import { useEffect, useState } from 'react'

const Category = ({ client, cardId, structure, refresh }) => {
  const { width } = useViewport(); const mobile = width < 832
  const { _id: catId, catName, catDescription, products } = structure

  const [ isSure, setIsSure ] = useState(false)
  const [ isHover, setIsHover ] = useState(false)
  useEffect(() => !isHover && setIsSure(false), [ isHover ])

  const addProduct = async () => {
    const body = { cardId, catId }
    await fetchJson('/api/card/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  const updateCategory = async (field, value) => {
    const body = { cardId, catId, field, value }
    await fetchJson('/api/card/category', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  const deleteCategory = async () => {
    const body = { cardId, catId }
    await fetchJson('/api/card/category', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  return (
    <motion.div 
      sx={{ 
        position: 'relative',
        width: '100%',
        backgroundColor: '#f4f5f5',
        transition: 'height 0.5s ease',
        height: (mobile ? 'fit-content' : `calc(127px + ${116*(Math.round((products.length + 1)/2))}px)`),
      }}
      id={catId}
      whileHover={{ backgroundColor: '#eee' }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <div sx={{ maxWidth: 'body', p: (mobile ? 0 : 3), pt: (mobile ? 4 : 3), m: '0 auto' }}>
        <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column', height: '75px', pl: mobile ? 2 : 0, justifyContent: 'space-evenly' }} >
          <Input
            client={client}
            defaultValue={catName}
            update={updateCategory}
            variant="h"
            field={'catName'}
            options={{
              width: 560,
              max: 40,
              empty: {
                prevent: true,
                err: 'Votre catégorie doit avoir un nom !'
              }
            }}
          />
          <Input
            client={client}
            defaultValue={catDescription}
            update={updateCategory}
            variant="light"
            field={'catDescription'}
            options={{
              width: 500,
              max: 80
            }}
          />
          {!client && <div
            sx={{
              transition: 'opacity 0.2s ease',
              height: '50px',
              width: '50px',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '5px',
              backgroundImage: isSure ? '' : 'url("/dustbinNoText.svg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '35%',
              cursor: 'pointer',
              borderRadius: '100px',
              opacity: (isHover || mobile) ? 1 : 0,
            }}
            onClick={() => setIsSure(true)}
          >
            <div sx={{ position: 'absolute', width: '250px', transform: isSure ? 'scaleX(1)' : 'scaleX(0)', left: '-200px', display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center', top: '25%', overflow: 'hidden', transition: 'transform 0.2s ease', transformOrigin: 'right', color: 'crimson' }}>Êtes-vous sûr ?
              <span sx={{ color: 'crimson' }} onClick={e => {e.stopPropagation(); setIsSure(false); deleteCategory()}}>Oui</span>
              <span sx={{ variant: 'Button.primary', px: 2 }} onClick={e => {e.stopPropagation(); setIsSure(false)}}>Non</span>
            </div>
          </div>}
        </div>
        <div sx={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gridGap: mobile ? 0 : 3 }}>
          <AnimatePresence initial={false}>
            {(products && mobile) && products.map((product, i) => (
              <ProductMobile
                client={client}
                layout
                key={product._id}
                index={i}
                cardId={cardId}
                catId={catId}
                infoSet={product}
                refresh={refresh}
              />
            ))}
            {(products && !mobile) && products.map((product, i) => (
              <ProductDesktop
                client={client}
                layout
                key={product._id}
                index={i}
                cardId={cardId}
                catId={catId}
                infoSet={product}
                refresh={refresh}
              />
            ))}
          </AnimatePresence>
          {!client && <div sx={{ variant: mobile ? 'Add.product.mobile' : 'Add.product.desktop' }} onClick={addProduct} />}
        </div>
      </div>
    </motion.div>
  )
}

export default Category

Category.propTypes = {
  cardId: PropTypes.string,
  infoSet: PropTypes.object,
  products: PropTypes.array,
  refresh: PropTypes.func,
}

/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset
import { jsx, Grid } from 'theme-ui'
import ProductMobile from './ProductMobile'
import ProductDesktop from './ProductDesktop'
import PropTypes from 'prop-types'
import fetchJson from '../../lib/fetchJson'
import Input from '../Input'
import { motion, AnimatePresence } from 'framer-motion'
import { useViewport } from '../../lib/hooks/useViewport'
import { useState } from 'react'

const Category = ({ cardId, infoSet, refresh }) => {
  const { _id: catId, catName, catDescription, products } = infoSet
  const [ isHover, setIsHover ] = useState(false)
  const { width } = useViewport()
  const mobile = width < 832
  
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
        <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column', height: '75px', pl: mobile ? 2 : 0, justifyContent: 'space-evenly'}} >
          <Input
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
            defaultValue={catDescription}
            update={updateCategory}
            variant="light"
            field={'catDescription'}
            options={{
              width: 500,
              max: 80
            }}
          />
          <div
            sx={{
              transition: 'opacity 0.2s ease',
              height: '50px',
              width: '50px',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '5px',
              backgroundImage: 'url("/dustbinNoText.svg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '35%',
              cursor: 'pointer',
              borderRadius: '100px',
              opacity: (isHover || mobile) ? 1 : 0,
            }}
            onClick={deleteCategory}
          />
        </div>
        <div sx={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', gridGap: mobile ? 0 : 3 }}>
          <AnimatePresence initial={false}>
            {(products && mobile) && products.map((product, i) => (
              <ProductMobile
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
          <div 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid',
              borderColor: 'primary',
              borderRadius: '3px',
              cursor: 'pointer',
              height: '100px',
              order: 999
            }} 
            onClick={addProduct}
          >
            <div sx={{ variant: mobile ? 'Add.product.mobile' : 'Add.product.desktop' }}  />
          </div>
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

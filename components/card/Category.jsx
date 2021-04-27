/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset

// Components
import Product from './product/index'
import Input from '../Input'
import { AddProduct } from './addButtons'
// Front
import PropTypes from 'prop-types'
import fetchJson from '../../lib/fetchJson'
import { jsx } from 'theme-ui'
import { motion, AnimatePresence } from 'framer-motion'
// Hooks
import { useEffect, useState } from 'react'
import { useViewport } from '../../lib/hooks/useViewport'
import { useTheme } from '../../lib/hooks/useTheme'

const Category = ({ client, cardId, structure, refresh }) => {
  const { _id: catId, catName, catDescription, products } = structure
  const { width } = useViewport()
  const mobile = width < 832
  const theme = useTheme()

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
        transition: 'height 0.5s ease',
        height: (mobile || theme.category.layout.desktop === '1fr') ? 'fit-content' : `calc(127px + ${136*(Math.round((products.length + (client ? 0 : 1))/2))}px)`,
        mt: 4,
        px: 4
      }}
      id={catId}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <div sx={{ maxWidth: 'body', p: mobile ? 0 : 3, pt: mobile ? 4 : 3, m: '0 auto', bg: theme.category.background[mobile ? 'mobile' : 'desktop' ] }}>
        <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column', height: '75px', pl: mobile ? 2 : 0, justifyContent: 'space-evenly', overflow: 'hidden', bg: 'white', mx: -4 }} >
          <Input
            client={client}
            defaultValue={catName}
            update={updateCategory}
            variant="head"
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
              opacity: isHover ? 1 : mobile ? 1 : 0,
            }}
            onClick={() => setIsSure(true)}
          >
            <div sx={{ position: 'absolute', width: isSure ?'250px' : 0, transform: isSure ? 'translateX(0)' : 'translateX(20px)', opacity: isSure ? 1 : 0, left: '-200px', display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center', top: '25%', overflow: 'hidden', transition: 'transform 0.2s ease', transformOrigin: 'right', color: 'crimson', pointerEvents: isSure ? 'initial' : 'none' }}>Êtes-vous sûr ?
              <span sx={{ color: 'crimson' }} onClick={e => {e.stopPropagation(); setIsSure(false); deleteCategory()}}>Oui</span>
              <span sx={{ variant: 'Button.primary', px: 2 }} onClick={e => {e.stopPropagation(); setIsSure(false)}}>Non</span>
            </div>
          </div>}
        </div>
        <div sx={{ display: 'grid', gridTemplateColumns: mobile ? theme.category.layout.mobile : theme.category.layout.desktop, gridGap: mobile ? 0 : 3 }}>
          <AnimatePresence initial={false}>
            {products.map((product, i) => (
              <Product
                client={client}
                key={product._id}
                index={i}
                cardId={cardId}
                catId={catId}
                infoSet={product}
                refresh={refresh}
              />
            ))}
          </AnimatePresence>
          {!client && <AddProduct add={addProduct} />}
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

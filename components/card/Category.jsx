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
import { jsx, Spinner } from 'theme-ui'
import { motion, AnimatePresence } from 'framer-motion'
// Hooks
import { useEffect, useState } from 'react'
import { useViewport } from '../../lib/hooks/useViewport'
import { useTheme } from '../../lib/hooks/useTheme'

const Category = ({ client, cardId, structure, refresh, resetCategory }) => {
  const { _id: catId, catName, catDescription, products } = structure
  const { width } = useViewport()
  const mobile = width < 832
  const theme = useTheme()
  const [ addingProduct, setAddingProduct ] = useState(false)
  const [ deletingCategory, setDeletingCategory ] = useState(false)

  const [ isSure, setIsSure ] = useState(false)
  const [ isHover, setIsHover ] = useState(false)
  useEffect(() => !isHover && setIsSure(false), [ isHover ])

  const addProduct = async () => {
    const body = { cardId, catId }
    setAddingProduct(true)
    await fetchJson('/api/card/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
    setAddingProduct(false)
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
    setDeletingCategory(true)
    const body = { cardId, catId }
    await fetchJson('/api/card/category', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
    setDeletingCategory(false)
    resetCategory()
  }

  return (
    <motion.div 
      sx={{ 
        position: 'relative',
        width: '100%',
        transition: 'height 0.5s ease',
        height: (mobile || theme.category.layout.desktop === '1fr') ? 'fit-content' : `calc(127px + ${136*(Math.round((products.length + (client ? 0 : 1))/2))}px)`,
        mt: theme.category.spaceTop[mobile ? 'mobile' : 'desktop' ],
        px: mobile ? 1 : 4,
      }}
      id={catId}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      {deletingCategory && <div sx={{ width: '100%', height: '100%', bg: 'darkgrey', position: 'absolute', zIndex: 1000, top: 0, left: 0, opacity: 0.4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner color={theme.colors.highlight} size={60} /></div>}
      <div sx={{ maxWidth: 'body', p: mobile ? 0 : 4, m: '0 auto', bg: theme.category.background[mobile ? 'mobile' : 'desktop' ] }}>
        <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column', height: 'fit-content', pb: 4, '& > *': { mt: 4 }, pl: mobile ? 2 : 0, justifyContent: 'space-evenly', overflow: 'hidden', ...theme.category.head[mobile ? 'mobile' : 'desktop']}} >
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
              },
              maxHeight: '95px'
            }}
          />
          <Input
            client={client}
            defaultValue={catDescription}
            update={updateCategory}
            variant="body"
            field={'catDescription'}
            options={{
              width: '90%',
              max: 80,
              maxHeight: '155px',
            }}
          />
          {!client && <div
            sx={{
              transition: 'opacity 0.2s ease',
              height: '50px',
              width: '50px',
              position: 'absolute',
              top: 3,
              transform: 'translateY(-50%)',
              right: mobile ? '16px' : 0,
              backgroundImage: isSure ? '' : 'url("/dustbinNoText.svg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '35%',
              cursor: 'pointer',
              borderRadius: '100px',
              zIndex: 10,
              opacity: isHover ? 1 : mobile ? 1 : 0,
            }}
            onClick={() => setIsSure(true)}
          >
            <div sx={{ position: 'absolute', width: isSure ? '250px' : 0, transform: isSure ? 'translateX(0)' : 'translateX(20px)', opacity: isSure ? 1 : 0, left: '-215px', display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center', top: '25%', overflow: 'hidden', transition: 'transform 0.2s ease', transformOrigin: 'right', color: 'crimson', pointerEvents: isSure ? 'initial' : 'none' }}>Êtes-vous sûr ?
              <span sx={{ color: 'crimson' }} onClick={e => {e.stopPropagation(); setIsSure(false); deleteCategory()}}>Oui</span>
              <span sx={{ variant: 'Button.primary', px: 2, bg: theme.colors.highlight }} onClick={e => {e.stopPropagation(); setIsSure(false)}}>Non</span>
            </div>
          </div>}
        </div> 
        <div sx={{ display: 'grid', gridTemplateColumns: mobile ? theme.category.layout.mobile : theme.category.layout.desktop, gridGap: mobile ? 0 : 4 }}>
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
          {!client && !addingProduct && <div onClick={addProduct} sx={mobile ? theme.button.mobile : theme.button.desktop}>{!mobile && 'ajouter un produit'}</div>}
          {addingProduct && <div onClick={addProduct} sx={{ ...theme.button[mobile ? 'mobile' : 'desktop'], backgroundImage: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner color={'#fff'} size={28} /></div>}
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

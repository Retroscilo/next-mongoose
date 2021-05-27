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
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion'
// Hooks
import { useEffect, useState } from 'react'
import { useViewport } from '../../lib/hooks/useViewport'
import { useTheme } from '../../lib/hooks/useTheme'
import { useCard } from '../../lib/hooks/useCard'

const Category = ({ client, catId, setCategory, items }) => {
  // infos & crud
  const { card, updateCard, useCategory } = useCard()
  const cardId = card._id
  const category = useCategory(catId)
  const { catName, catDescription, products } = category
  // loading & actions states
  const [ addingProduct, setAddingProduct ] = useState(false)
  const [ deletingCategory, setDeletingCategory ] = useState(false)
  const [ isHover, setIsHover ] = useState(false)
  const [ isSure, setIsSure ] = useState(false) // delete cat confirmation
  useEffect(() => !isHover && setIsSure(false), [ isHover ])
  // styles & responsive
  const { width } = useViewport()
  const mobile = width < 832
  const { theme } = useTheme()
  // crud wrappers
  const addProduct = async () => {
    setAddingProduct(true)
    await category.addProduct()
    setAddingProduct(false)
  }

  const remove = async () => {
    setDeletingCategory(true)
    setIsSure(false)
    if (card.catOrder[0] === catId) setCategory(card.catOrder[1])
    else setCategory(card.catOrder[0])
    await category.delete()
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
      <div sx={{ maxWidth: 'body', p: mobile ? 0 : 4, m: '0 auto', bg: theme.category.background[mobile ? 'mobile' : 'desktop' ] }}>
        <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column', height: 'fit-content', pb: 4, '& > *': { mt: 4 }, pl: mobile ? 2 : 0, justifyContent: 'space-evenly', overflow: 'hidden', ...theme.category.head[mobile ? 'mobile' : 'desktop']}} >
          <Input
            client={client}
            defaultValue={catName}
            update={category.update}
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
            update={category.update}
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
              <span sx={{ color: 'crimson' }} onClick={e => {e.stopPropagation(); remove()}}>Oui</span>
              <span sx={{ variant: 'Button.primary', px: 2, bg: theme.colors.highlight }} onClick={e => {e.stopPropagation(); setIsSure(false)}}>Non</span>
            </div>
          </div>}
          
        </div> 
        <AnimatePresence initial={false}>
            <div sx={{ display: 'grid', gridTemplateColumns: theme.category.layout[mobile ? 'mobile' : 'desktop'], gridGap: mobile ? 0 : 4 }}>
              {items.map((id, i) => (
                <Product
                  key={id}
                  client={client}
                  prodId={id}
                  index={i}
                  catId={catId}
                />
              ))}
              {!client && !addingProduct && <div onClick={addProduct} sx={mobile ? theme.button.mobile : theme.button.desktop}>{!mobile && 'ajouter un produit'}</div>}
              {addingProduct && <div onClick={addProduct} sx={{ ...theme.button[mobile ? 'mobile' : 'desktop'], backgroundImage: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner color={'#fff'} size={28} /></div>}
            </div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Category

Category.propTypes = {
  cardId: PropTypes.string,
  infoSet: PropTypes.object,
  products: PropTypes.array,
}

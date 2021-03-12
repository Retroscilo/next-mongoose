/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset
import { jsx, Grid } from 'theme-ui'
import Product from './Product'
import ProductDesktop from './ProductDesktop'
import PropTypes from 'prop-types'
import fetchJson from '../lib/fetchJson'
import Input from '../components/Input'
import { AnimatePresence } from 'framer-motion'
import { useViewport } from '../lib/hooks/useViewport'

const Category = ({ cardId, infoSet, refresh }) => {
  const { _id: catId, catName, catDescription, products } = infoSet
  const { width } = useViewport()

  const breakpoint = 640

  const addProduct = async () => {
    const body = { cardId, catId }
    await fetchJson('/api/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  const updateCategory = async (field, value) => {
    const body = { cardId, catId, field, value }
    await fetchJson('/api/category', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  const deleteCategory = async () => {
    const body = { cardId, catId }
    await fetchJson('/api/category', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await refresh()
  }

  return (
    <div sx={{ variant: 'Category', p: (width >= breakpoint ? 3 : 0) }}>
      <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column' }}>
        <Input
          defaultValue={catName}
          update={updateCategory}
          variant="h"
          field={'catName'}
        />
        <Input
          defaultValue={catDescription}
          update={updateCategory}
          variant="light"
          field={'catDescription'}
        />
        <div
          sx={{
            height: '50px',
            width: '50px',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '5px',
            background: 'crimson',
            backgroundImage: 'url("/dustbin.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '35%',
            cursor: 'pointer',
            borderRadius: '100px',
          }}
          onClick={deleteCategory}
        />
      </div>
      <AnimatePresence initial={false} >
        { (products && width < breakpoint)
        && <div>
          {products.map(product => (
            <Product
              key={product._id}
              cardId={cardId}
              catId={catId}
              infoSet={product}
              refresh={refresh}
            />
          ))}
          <div sx={{ variant: 'Add.product.mobile' }} onClick={addProduct} />
        </div>
        }
        { (products && width >= breakpoint)
        && <Grid columns={2}>
          {products.map(product => (
            <ProductDesktop
              key={product._id}
              cardId={cardId}
              catId={catId}
              infoSet={product}
              refresh={refresh}
              exit={{ transform: 'scale(0)' }}
            />
          ))}
          <div sx={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75px' }}>
            <div sx={{ variant: 'Add.product.desktop' }} onClick={addProduct}> Ajouter un produit </div>
          </div>
        </Grid>
        }
      </AnimatePresence>
    </div>
  )
}

export default Category

Category.propTypes = {
  cardId: PropTypes.string,
  infoSet: PropTypes.object,
  products: PropTypes.array,
  refresh: PropTypes.func,
}

/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset
import { jsx } from 'theme-ui'
import Product from './Product'
import PropTypes from 'prop-types'
import fetchJson from '../lib/fetchJson'
import Input from '../components/Input'
import { AnimatePresence } from 'framer-motion'
import { useViewport } from '../lib/hooks/useViewport'

const Category = ({ cardId, infoSet, refresh }) => {
  const { _id: catId, catName, catDescription, products } = infoSet
  const { width } = useViewport()

  const breakpoint = 640
  if (width < breakpoint) console.log('break')

  const addProduct = async () => {
    const body = { cardId, catId }
    await fetchJson('/api/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    refresh()
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
    <div sx={{ variant: 'Category' }}>
      <div sx={{ display: 'flex', position: 'relative', flexDirection: 'column', p: 2 }}>
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
        { products && products.map((product, i) => (
          <Product
            key={product._id}
            cardId={cardId}
            catId={catId}
            infoSet={product}
            refresh={refresh}
          />
        ))}
      </AnimatePresence>
      <div
        sx={{ variant: 'Add.product' }}
        onClick={addProduct}
      />
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

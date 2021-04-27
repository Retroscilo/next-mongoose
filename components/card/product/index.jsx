/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useViewport } from '../../../lib/hooks/useViewport'
import ProductMobile from './Mobile'
import ProductDesktop from './Desktop'

const Product = props => {
  const { width } = useViewport(); const mobile = width < 832

  if (mobile) return <ProductMobile { ...props } />
  return <ProductDesktop { ...props } />
}

export default Product

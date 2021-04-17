/** @jsxRuntime classic */
/** @jsx jsx */
import { useViewport } from '../../lib/hooks/useViewport'
import { jsx } from 'theme-ui'

export const AddProduct = ({ add }) => {
  const { width } = useViewport()
  return (
    <div
      className={`addProduct addProduct--${ width < 832 ? 'mobile' : 'desktop' }`}
      onClick={add}
      sx={{ bg: 'primary', borderColor: 'primary' }}
    >
      <style jsx>{`
        .addProduct
          z-index 999
        .addProduct--mobile
          position absolute
          left calc(50% - 25px)
          bottom -25px
          width 50px
          height 50px
          border-radius 100px
          background-image url('/+.svg')
          background-repeat no-repeat
          background-position center
          background-size 50%
          cursor pointer
          transition all .3s

        .addProduct--desktop
          display flex
          justify-content center
          align-items center
          border 2px solid
          border-radius 3px
          cursor pointer
          height 120px
          position relative
          order 999
          {/* &::after 
            content ""
            position absolute
            width 35px
            height 35px
            top 50%
            left 50% */}
          &::before
            content "Ajouter un produit"
            color primary
            mr 2
      `}</style>
    </div>
  )
}

export const AddCategory = ({ ...props }) => {
  return (
    <div {...props} sx={{ my: 5 }}>
      <div sx={{ bg: 'primary', my: 5, '&:hover': { boxShadow: 'low' } }} className={'addCat'}>Ajouter une catégorie</div>
      <style jsx>{`
        .addCat
          color white
          width 185px
          height 30px
          border-radius 3px
          margin 0 auto
          display flex
          justify-content center
          align-items center
          cursor pointer
          transition boxShadow .2s ease
        `}</style>
    </div>
  )
}


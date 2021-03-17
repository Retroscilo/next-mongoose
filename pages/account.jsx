/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner} from 'theme-ui'
import theme from '../theme'

const account = () => {
  return (
    <div
      sx={{ 
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        minHeight: `calc(100vh - ${ theme.sizes.footer + theme.sizes.header }px)`
      }}
    >
      <nav
        sx={{ 
          bg: 'white'
         }}
      >
        <ul>
          <li>Général</li>
          <li>Restaurants</li>
          <li>Abonnements</li>
        </ul>
        <style jsx>{`
          ul {
            padding: 0;
            margin: 0;
          }

          ul li {
            padding: 20px 40px;
            cursor: pointer;
          }

          ul li {
            border-bottom: 1px solid lightgrey;
          }
        `}</style>
      </nav>
    </div>
  )
}

export default account

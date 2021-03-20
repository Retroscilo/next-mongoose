/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
// @refresh reset
import { jsx } from 'theme-ui'
import useUser from '../../lib/hooks/useUser'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'
import Category from '../../components/Category'
import useCard from '../../lib/hooks/useCard'
import CardHeader from '../../components/RestaurantHeader'
import React from 'react'

const Card = () => {
  const router = useRouter()
  const { id: cardId } = router.query // get related card id
  const { categories, updateCard } = useCard(cardId) // get card structure & method to use to display changes

  const { user } = useUser({ // redirect if no user connected
    redirectTo: '/login',
    redirectIfFound: false,
  })
  console.log(user)
  const addCategory = async () => {
    const body = { cardId }
    await fetchJson('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await updateCard()
  }

  return (
    <div sx={{ width: '100vw', m: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {!categories && <h1>Loading</h1>}
      {categories
        && <>
          <CardHeader />
          <div sx={{ bg: 'white', position: 'sticky', top: '70px', width: '100vw', zIndex: 60 }}>
            <ul sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'body', mx: 'auto', px: 3 }}>
              {categories.map(category => (
                <li key={category._id}><a href={`#${ category._id }`}>{category.catName}</a></li>
              ))}
            </ul>
          </div>
          {categories.map((category, i) => (
            <Category
              key={i}
              cardId={cardId} // related card id for requests
              catName={category.catName}
              infoSet={category} // category structure with title, desc. etc...
              refresh={updateCard} // method to call after each update in db (post/put)
            />
          ))}
        </>
      }
      <div sx={{ variant: 'Add.category' }} onClick={addCategory}>Ajouter une catégorie</div>
    </div>
  )
}

export default Card

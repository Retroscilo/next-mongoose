/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import Link from 'next/link'
import useUser from '../lib/useUser'
import { useRouter } from 'next/router'
import fetchJson from '../lib/fetchJson'

const Header = () => {
  const { user, mutateUser } = useUser()
  const router = useRouter()
  return (
    <header sx={{ width: '100vw', background: 'white', height: '70px', boxSizing: 'content-box', display: 'flex', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', position: 'sticky', top: '0', zIndex: '60' }}>
      <nav>
        <ul sx={{ display: 'flex', justifyContent: 'space-between', width: '100vw', p: 2 }}>
          <li>
            <Link href="/">
              <a>PixMe</a>
            </Link>
          </li>
          {!user?.isLoggedIn && (
            <>
              <li>
                <Link href="/login">
                  <a>Connection</a>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <a>Inscription</a>
                </Link>
              </li>
            </>
          )}
          {user?.isLoggedIn && (
            <>
              <li>
                <Link href="/cards">
                  <a>Mes cartes</a>
                </Link>
              </li>
              <li>
                <a
                  href="/"
                  onClick={async e => {
                    e.preventDefault()
                    await mutateUser(fetchJson('/api/logout'))
                    router.push('/login')
                  }}
                >
                  { user.email }
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

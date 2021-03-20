/* eslint-disable no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState, useRef } from 'react'
import Link from 'next/link'
import useUser from '../lib/hooks/useUser'
import { useRouter } from 'next/router'
import fetchJson from '../lib/fetchJson'
import { useClickOutside } from '../lib/hooks/useClickOutside'
import theme from '../theme'

const Header = () => {
  const { user, mutateUser } = useUser()
  const router = useRouter()
  const [ displayAccountOptions, setDAO ] = useState(false)

  const accountOptions = useRef(null)
  useClickOutside(accountOptions, () => setDAO(false))
  return (
    <header sx={{ width: '100vw', background: 'white', height: 'header', boxSizing: 'content-box', display: 'inline-block', borderBottom: '1px solid darkgrey', position: 'sticky', top: '0', zIndex: '600' }}>
      <nav>
        <ul sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100vw', height: 'header', px: 3, m: 0, '& li': { ml: 3 } }}>
          <li sx={{ position: 'absolute', left: 0 }}>
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
              <li
                ref={accountOptions}
                onClick={() => setDAO(!displayAccountOptions)}
                sx={{ cursor: 'pointer', position: 'relative' }}
              >
                Mon compte
                {displayAccountOptions && <ul sx={{ bg: 'white', minWidth: '10rem', position: 'absolute', right: 0, top: 5, width: 'fit-content', fontSize: 1, m: 0, p: 0, display: 'flex', flexDirection: 'column', borderRadius: '3px', border: '1px solid lightgrey', boxShadow: 'high', '& li': { px: 3, py: 3, ml: 0 }, '& li:hover': { bg: '#EDEDED' } }}>
                  <li sx={{ bg: '#EDEDED', cursor: 'default' }}>{user.email}</li>
                  <li
                    sx={{ bg: 'white', cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation()
                      setDAO(false)
                      router.push('/account')
                    }}
                  >
                    Options
                  </li>
                  <li
                    sx={{ bg: 'white', borderBottomLeftRadius: '3px' }}
                    onClick={async e => {
                      e.preventDefault()
                      await mutateUser(fetchJson('/api/logout'))
                      setDAO(false)
                      router.push('/login')
                    }}
                  >
                    Déconnection
                  </li>
                </ul>}
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

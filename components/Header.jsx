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
import { OptionsList } from '../components/misc/index'

const Header = () => {
  const { user, mutateUser } = useUser({ redirectIfFound: false })
  const router = useRouter()
  const [ displayAccountOptions, setDAO ] = useState(false)

  const accountOptions = useRef(null)
  useClickOutside(accountOptions, () => setDAO(false))
  return (
    <header sx={{ background: 'white', height: 'header', boxSizing: 'content-box', display: 'inline-block', borderBottom: '1px solid darkgrey', position: 'sticky', top: '0', zIndex: '9999', width: '100%' }}>
      <nav>
        <ul sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 'header', px: 3, m: 0, '& > li': { ml: 3 } }}>
          <li sx={{ position: 'absolute', left: 0 }}>
            <Link href="/">
              <a><div sx={{ background: 'url("/logo--full.svg") no-repeat', width: '75px', height: '30px', backgroundSize: 'contain' }} /></a>
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
                <OptionsList label={'Mon compte'} >
                  <li
                    sx={{ color: 'textLight' }}
                    onClick={() => router.push('/account') }
                  >{user.email}</li>
                  <li
                    sx={{ cursor: 'pointer', color: 'primary' }}
                    onClick={() => router.push('/account')}
                  >
                    Options
                  </li>
                  <li
                    sx={{ borderBottomLeftRadius: '3px', color: 'crimson', cursor: 'pointer' }}
                    onClick={async () => await mutateUser(fetchJson('/api/user/logout', { method: 'POST' })) }
                  >
                    Déconnection
                  </li>
                </OptionsList>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

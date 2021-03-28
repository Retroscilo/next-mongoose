/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'
import { useState } from 'react'

const MailAction = () => {
  const router = useRouter()
  const [ verified, setVerified ] = useState(false)
  console.log(router.query)
  return (
    <div>
      {verify &&
        <div>test</div>}
    </div>
  )
}

export default MailAction

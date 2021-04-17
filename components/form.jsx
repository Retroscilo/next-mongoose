/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui'
import theme from '../theme'
import PropTypes from 'prop-types'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

// form title: h1 / subtitle: h2
const Form = ({ onSubmit, children, errorMsg }) => {
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(e)
  }

  const wizzle = useAnimation()

  useEffect(() => errorMsg && wizzle.start({ x: [ -10, 10, -10, 10, 0 ] }),[ errorMsg ])

  return (
    <motion.form
      animate={wizzle}
      sx={{
        position: 'relative',
        bg: 'white',
        mx: 'auto',
        mb: [ 0, 2 ],
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: 'low',
        borderRadius: '3px',
        width: '100%',
        height: [ 'calc(100vh - 95px)', '100%' ],
        minHeight: '535px',
        width: [ '100%', '32em' ],
        '& h1': { my: 0, fontSize: 4, fontWeight: '500' },
        '& h2': { color: 'textLight', fontSize: 2, fontWeight: '400', my: 0, mt: 3, lineHeight: 0.9 },
        '& label, & input': { mt: 4, color: 'textLight' },
        '& input:not([type="submit"]), textarea': {
          transition: 'box-shadow 0.3s',
          mt: 2,
          border: '1px solid lightgrey',
          height: '40px',
          borderRadius: '3px',
          color: 'textLight',
          px: 3,
          fontSize: 2,
          outline: 'none',
        },
        '& textarea': { resize: 'none', variant: 'text.body', height: 'fit-content', py: 2, '&::placeholder': { color: '#C2C2C2' } },
        '& input:not([type="submit"]):focus': {
          boxShadow: `0 0 2px .5px royalblue`,
          outline: 'none',
        },
        '& input[type="submit"]': {
          variant: 'Button.primary',
          width: '100%',
          height: '40px',
        },
        '& sub': { color: 'textLight', mt: 1 }
     }} 
      onSubmit={handleSubmit}
    >
      {children}
      {errorMsg &&
      <motion.div
        variants={{
          hidden: { opacity: 0, bottom: 40 },
          visible: { opacity: 1, bottom: 30 },
        }}
        initial={'hidden'}
        animate={'visible'}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        sx={{ mt: 2, color: 'crimson', '&::before': { content: '""', width: '16px', height: '15px', background: 'url("/warn.svg")', display: 'inline-block', backgroundSize: 'contain', mr: 1, mt: 1 } }}
      >
        {errorMsg}
      </motion.div>}
    </motion.form>
  )
}

export default Form

Form.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]),
  errorMsg: PropTypes.string,
  onSubmit: PropTypes.func,
}

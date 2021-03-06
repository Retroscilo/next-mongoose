const theme = {
  useBorderBox: true,
  fonts: {
    body: 'Ubuntu, sans-serif',
    heading: 'Ubuntu, sans-serif',
  },
  fontWeights: {
    body: '400',
    heading: '700',
    bold: '700',
  },
  breakpoints: [ '40em', '52em', '64em' ],
  space: [ 0, 4, 8, 16, 32, 64, 128, 256, 512 ],
  fontSizes: [ 12, 14, 16, 20, 24, 32, 48, 64, 96 ],
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  letterSpacings: {
    body: 0.5,
    heading: -0.5,
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#FFC837',
    accent: '#FF4D4D',
  },
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      letterSpacing: 'heading',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      letterSpacing: 'body',
    },
    h1: {
      variant: 'text.heading',
      fontSize: 7,
    },
    h2: {
      variant: 'text.heading',
      fontSize: 4,
    },
    h3: {
      variant: 'text.heading',
      fontSize: 3,
    },
    h4: {
      variant: 'text.heading',
      fontSize: 2,
    },
    h5: {
      variant: 'text.heading',
      fontSize: 1,
    },
    h6: {
      variant: 'text.heading',
      fontSize: 0,
    },
  },
  Card: {
    width: 250,
    border: '1px solid black',
    m: '10px',
    position: 'relative',
  },
  Category: {
    position: 'relative',
    boxSizing: 'content-box',
    width: '100%',
    bg: '#f4f5f5',
    pb: '50px',
    overflow: 'hidden',
    '&:first-of-type': {
      pt: '50px',
    },
    catName: {
      variant: 'Input.default',
      fontSize: '30px',
      fontWeight: 'bold',
      bg: '#f4f5f5',
      m: 2,
    },
    catDescription: {
      variant: 'Input.default',
      fontsize: '24px',
      bg: '#f4f5f5',
      m: 2,
    },
  },
  Product: {
    mobile: {
      borderTop: '1px solid lightgrey',
      boxSizing: 'border-box',
      height: '100px',
      width: '100vw',
      bg: 'background',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 2,
    },
    prodName: {
      variant: 'Input.default',
      fontsize: '16px',
    },
    prodDescription: {
      variant: 'Input.default',
      fontsize: '14px',
      color: 'accent',
    },
    prodPrice: {
      variant: 'Input.default',
      fontsize: '16px',
    },
  },
  SampleCards: {
    width: '100px',
    height: '100px',
    background: 'gold',
    borderRadius: '5px',
  },
  Input: { // Editable text field
    default: {
      border: 'none',
      fontFamily: 'Ubuntu, sans-serif',
    },
  },
  Add: { // New category & Product CTA
    product: {
      position: 'absolute',
      zIndex: '2',
      left: 'calc(50% - 25px)',
      bottom: '-15px',
      width: '50px',
      height: '50px',
      borderRadius: '100px',
      bg: 'primary',
      backgroundImage: 'url("/+.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '50%',
      boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.12)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.18), 0 2px 5px rgba(0,0,0,0.18)' },
      '&:active': { boxShadow: '0 2px 8px rgba(0,0,0,0.18), 0 2px 5px rgba(0,0,0,0.18)' },
    },
    category: {
      background: 'white url("/+.svg") no-repeat center',
      backgroundSize: '40%',
      width: '30px',
      height: '30px',
      border: '1px solid black',
      m: '0 auto',
      cursor: 'pointer',
    },
  },
}

export default theme

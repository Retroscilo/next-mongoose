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
    textLight: '#565656',
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
    body: {
      fontFamily: 'body',
      lineHeight: 'body',
      letterSpacing: 'body',
    },
    light: {
      fontFamily: 'body',
      lineHeight: 'body',
      letterSpacing: 'body',
      color: 'textLight',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      letterSpacing: 'body',
    },
  },
  Input: { // Editable text field
    h: {
      fontSize: 4,
      mt: 2,
      mb: 2,
    },
    regular: {
      variant: 'text.body',
      fontSize: 2,
    },
    light: {
      variant: 'text.light',
      fontsize: 2,
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
  },
  Product: {
    mobile: {
      borderTop: '1px solid lightgrey',
      boxSizing: 'border-box',
      height: 'fit-content',
      width: '100vw',
      bg: 'background',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 2,
    },
    desktop: {

    }
  },
  SampleCards: {
    width: '100px',
    height: '100px',
    background: 'gold',
    borderRadius: '5px',
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

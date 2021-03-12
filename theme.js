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
  radii: [ 3 ],
  breakpoints: [ '40em', '52em', '64em' ],
  space: [ 0, 4, 8, 16, 32, 64, 128, 256, 512 ],
  fontSizes: [ 12, 14, 16, 20, 24, 32, 48, 64, 96 ],
  shadows: {
    low: '0px 0px 7px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.12)',
    hover: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  lineHeights: {
    body: 1.2,
    heading: 1.125,
  },
  letterSpacings: {
    body: 0.5,
    heading: -0.5,
  },
  colors: {
    text: '#000',
    textLight: '#565656',
    background: '#f4f5f5',
    primary: 'rgb(2555, 200, 55)',
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
      backgroundColor: 'background',
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      letterSpacing: 'body',
    },
  },
  Input: { // Editable text field
    h: {
      variant: 'text.body',
      fontSize: 4,
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
  Product: {
    //! Category height calculated on product height. If you have to change, DON'T FORGET to change the equation in Category. Bitch.
    mobile: {
      borderTop: '1px solid lightgrey',
      height: '100px',
      width: '100vw',
      bg: '#fff',
      overflow: 'hidden',
      padding: 2,
    },
    desktop: {
      borderRadius: 0,
      height: '100px',
      bg: '#fff',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 2,
    },
  },
  SampleCards: {
    width: '100px',
    height: '100px',
    background: 'gold',
    borderRadius: '5px',
  },
  Add: { // New category & Product CTA
    product: {
      mobile: {
        position: 'absolute',
        zIndex: '2',
        left: 'calc(50% - 17.5px)',
        bottom: '-25px',
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
      desktop: {
        variant: 'Add.product.mobile',
        width: '35px',
        height: '35px',
        bottom: '0',
      },
    },
    category: {
      position: 'absolute',
      bottom: 20,
      bg: 'primary',
      color: '#fff',
      width: '185px',
      height: '30px',
      borderRadius: 0,
      m: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s ease',
      '&hover': { boxShadow: 'low' },
    },
  },
}

export default theme

const colors = {
  primary: 'rgba(253, 218, 188, 0.4)',
  highlight: '#D36161',
}

export default {
  name: 'Qalme',
  backgrounds: [ 'dégradé', 'sable-rose', 'crépuscule', 'marbre-corail', 'marbre-rose' ],
  layout: 'classic',
  font: {
    restaurant: { font: '3rem Sacramento' },
    head: {
      font: '2.8rem Sacramento',
      color: 'black',
      lineHeight: '0.8 !important',
      zIndex: 2,
      position: 'relative',
      '&::before': {
        content: '""',
        width: '200px',
        bg: colors.primary,
        height: '20px',
        bottom: '-5px',
        position: 'absolute',
        zIndex: -1,
        opacity: '.5',
      },
    },
    headSmall: {
      font: '2rem Sacramento', color: 'black', lineHeight: '1 !important',
    },
    body: { font: '1.2rem Cormorant', color: 'black' },
    highlight: { font: '1.7rem Sacramento', color: colors.highlight },
  },
  category: {
    layout: {
      mobile: '1fr',
      desktop: '1fr',
    },
    background: {
      mobile: '',
      desktop: '#fff',
    },
    head: {
      mobile: {
        bg: 'white',
        mx: -1,
        px: 1,
      },
    },
    spaceTop: {
      mobile: 0,
      desktop: 4,
    },
  },
  product: {
    background: {
      desktop: colors.primary,
    },
    layout: {
      desktop: {
        gridTemplateColumns: 'auto 1fr 170px 100px',
        gridTemplateRows: '35% auto',
        gridTemplateAreas: '"photo prodName label prodPrice" "photo prodDescription prodDescription prodDescription"',
      },
      mobile: {
        gridTemplateColumns: 'auto 1fr 60px',
        gridTemplateRows: '4fr 6fr',
        gridTemplateAreas: '"photo prodName prodPrice" "photo prodDescription label"',
      },
      XS: {
        gridTemplateColumns: 'auto auto 1fr',
        gridTemplateRows: '1fr 1.5fr 0.5fr',
        gridTemplateAreas: '"photo prodName prodName" "photo prodDescription prodDescription" "photo label prodPrice"',
      },
    },
  },
  button: {
    mobile: {
      position: 'absolute',
      bottom: '-75px',
      left: 'calc(50% - 17.5px)',
      backgroundColor: colors.highlight,
      width: '35px',
      height: '35px',
      color: 'white',
      borderRadius: '3px',
      cursor: 'pointer',
      backgroundImage: "url('/+.svg')",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '50%',
      zIndex: 999,
    },
    desktop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: '-75px',
      left: 'calc(50% - 100px)',
      backgroundColor: colors.highlight,
      width: '200px',
      height: '35px',
      color: 'white',
      borderRadius: '3px',
      cursor: 'pointer',
      zIndex: 999,
    },
  },
  colors,
}

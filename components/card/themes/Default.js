const colors = {
  primary: 'rgba(253, 218, 188, 0.4)',
}

export default {
  layout: 'classic',
  font: {
    restaurant: { font: '3rem Sacramento' },
    head: {
      font: '2.8rem Sacramento',
      color: 'black',
      zIndex: 2,
      position: 'relative',
      '&::before': {
        content: '""',
        width: '200px',
        bg: colors.primary,
        height: '20px',
        top: '15px',
        position: 'absolute',
        zIndex: -1,
        opacity: '.5',
      },
    },
    headSmall: {
      font: '2rem Sacramento', color: 'black',
    },
    body: { font: '1.2rem Cormorant', color: 'black' },
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
        mx: -4,
        px: 4,
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
        gridTemplateColumns: '50px calc(100% - 134px) 84px',
        gridTemplateRows: '1fr 1fr 1fr',
        gridTemplateAreas: '"prodName prodName photo" "prodDescription prodDescription photo" "prodPrice labelphoto"',
      },
    },
  },
  colors,
}

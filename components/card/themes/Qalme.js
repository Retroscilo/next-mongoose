const colors = {
  primary: 'rgba(253, 218, 188, 0.4)',
}

export default {
  layout: 'classic',
  font: {
    restaurant: { font: '3rem Sacramento' },
    head: { font: '2.8rem Sacramento', color: 'black', zIndex: 2, position: 'relative', '&::before': { content: '""', width: '200px', bg: colors.primary, height: '20px', top: '15px', position: 'absolute', zIndex: -1, opacity: '.5' } },
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
  },
  product: {
    background: {
      desktop: colors.primary
    }
  },
  colors,
}

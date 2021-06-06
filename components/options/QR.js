import QRCode from 'qrcode'

const drawQR = async (colors, ref, cardId) => {
  const c = colors.split(':')
  await QRCode.toCanvas(ref, 'https://localhost:3000/client/' + cardId, { color: { dark: c[0], light: c[1] }, errorCorrectionLevel: 'M' })
}

export default drawQR

import QRCode from 'qrcode'
import nc from 'next-connect'

const generateQR = async (path, text) => {
  try {
    await QRCode.toFile(path, text)
  } catch (err) {
    console.error(err)
  }
}

const handler = nc()
  .post(async (req, res) => {
    const text = req.body
    await QRCode.toFile('~/desktop/filename.png', 'text')
    return res.status(200).end()
  })

export default handler

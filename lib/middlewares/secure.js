import withSession from '../../lib/session'

const secure = (req, res, next) => {
  const session = req.session.get('user')
  if (!session) return res.status(401).send({ message: 'no user connected' })
  next()
}

export default withSession(secure)

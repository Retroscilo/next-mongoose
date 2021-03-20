/* eslint-disable curly */
import withSession from '../../lib/session'
import connect from '../../lib/middlewares/mongodb'

export default connect(withSession(async (req, res) => {
  const user = req.session.get('user')
  if (user) {
    res.json({
      isLoggedIn: true,
      ...user,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
}))

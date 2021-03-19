/* eslint-disable curly */
import withSession from '../../lib/session'
import connect from '../../lib/connectDB'
import User from '../../lib/models/user.model'

export default withSession(async (req, res) => {
  const user = req.session.get('user')
  if (user) {
    await connect()
    const userInfo = await User.findById(user._id)
    console.log(user)
    console.log(userInfo)

    res.json({
      isLoggedIn: true,
      ...user,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
})

import nodemailer from 'nodemailer'

export const generateCode = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) token += characters[Math.floor(Math.random() * characters.length)]
  return token
}

export const sendConfirmationMail = async (mail, code) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
      user: 'loic.torresg@gmail.com',
      pass: 'c5rfk6ybh3Ms9Qq7',
    },
  })
  await transporter.sendMail({
    from: '"PixMe" <hello@pixme.com>', // sender address
    to: mail, // list of receivers
    subject: 'Confirmez votre mail Pixme ✔', // Subject line
    html: `<b>Merci de vous être inscrit, nous sommes ravi de vous compter parmi nos utilisateurs !</b> <br /> Une dernière étape avant de pouvoir créer votre carte digitale 🔜 <br /> Cliquer sur ce lien pour activer votre compte et profiter de nos services : <a href='localhost:3000/mailAction/${code}'>J'active mon compte</a>`, // html body
  })
}

export const sendResetPassword = async (mail, code) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    auth: {
      user: 'loic.torresg@gmail.com',
      pass: 'c5rfk6ybh3Ms9Qq7',
    },
  })
  await transporter.sendMail({
    from: '"PixMe" <hello@pixme.com>', // sender address
    to: mail, // list of receivers
    subject: 'Changez votre mot de passe PixMe', // Subject line
    html: `<b>Vous recevez ce mail car vous avez fait une demande de changement de votre mot de passe PixMe !</b> <br /> Cliquer ici pour saisir un nouveau mot de passe : <a href='localhost:3000/mailAction/${code}'>Je change mon mot de passe</a> <br /> Si vous n'avez pas fait cette demande, ignorez ce message`, // html body
  })
}

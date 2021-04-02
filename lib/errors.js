// this function handle common errors for the Input Component
export default e => {
  const cleanError = e.errors[Object.keys(e.errors)[0]].properties
  console.log(cleanError)
  switch (cleanError.type) {
  case 'maxlength' :
    return `${ cleanError.maxlength } charactères maximum !`
  case ('user defined' && cleanError.path === 'email') :
    return 'Merci de verifier votre adresse email !'
  default:
    return "Quelque chose s'est passé de travers, essayez de recharger la page !"
  }
}

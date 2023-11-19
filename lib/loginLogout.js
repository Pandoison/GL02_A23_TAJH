const jwt = require('jsonwebtoken'); //permet de générer etr vérifier les jsonWeb Tokens
const maxAge = 5*60*60*1000; //temps pendant lequel reste connecté l'utilisateur (ici 5h)


const createToken = (id) =>{ //fonction pour créer le token et le stocker dans le fichier token.env
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge   
    })
};

module.exports.login = async(req,res) => { //fonction d'identification de l'utilisateur 
    const { email, password } = req.body
  
    try {
      const user = await UserModel.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge});
      res.status(200).json({ user: user._id})
    } catch (err){
      const errors = loginError(err);
      res.status(200).json({ errors });
    }
}

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
 const login_error = "Email ou mot de passse éroné, veuillez réessayer";

module.exports.loginError = (err)=>{
    let error = {email: '', password: ''}
    error = login_error;
    return error;
}
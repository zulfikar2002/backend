const jwt = require('jsonwebtoken');


SECRET = process.env.SECRET
const Auth = {
    verifyToken(req, res, next){
        // const {token = req.cookies['JWT']
        const {token} = req.body
       
        if (token) {
            // 12. Lalukan jwt verify 
            const verified = jwt.verify(token, SECRET);
            req.verified = verified
            if(verified){
                console.log("Successfully Verified");
                return next();
            }else{
                // Access Denied
                return res.status(401).send(error);
            }

        } else {
          res.status(403).send({message: 'Youre not authenticated, please login first'})
            console.log('Youre not authenticated');
        }
    
  }
}

module.exports = Auth;
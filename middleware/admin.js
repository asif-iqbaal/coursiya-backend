import jwt from 'jsonwebtoken'
import JWT_SECRET from '../config.js'
function adminMiddleware(req,res,next){
    
        const token = req.headers.authorization;
        const word = token.split(" ");
        console.log(word);
        const jwtToken = word[1];
        console.log(jwtToken);
        const decodedValue = jwt.verify(jwtToken,JWT_SECRET);

        if(decodedValue.username){
                next();
        }
        else{
            res.status(403).json({
                msg : "you are not authenticated"
            })
        }
}
export default adminMiddleware;
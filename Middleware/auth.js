const jwt = require('jsonwebtoken');
const { ApiError } = require('./apiError');
require('dotenv').config()

const jwtSign = (payload) => {
    return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'10m'});
}

const verifyToken = (req,res,next) => {
    const token = req.rawHeaders[1].split(' ')[1];
    if(!token){
        let err = new ApiError(403,'Forbidden');
        return next(err);
    }
    try{
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.userEmail = decoded.email;
        next();
    }catch(err){
        let error = new ApiError(401,"Unauthorized");
        next(error)
    }
}

module.exports = {
    jwtSign,
    verifyToken
}
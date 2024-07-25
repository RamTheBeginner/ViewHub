import jwt from 'jsonwebtoken'

export const verifyToken = (request , response , next) => {
    //console.log(request.cookies);
    const token = request.cookies.jwt;
    //console.log({token});
    if(!token) return response.status(401).send("You are not Authorized");
    jwt.verify(token , process.env.JWT_KEY , async(err , payload) => {
        if(err){
            return response.status(403).send("Login Has Expired");
        }
        request.userId = payload.userId;
        next(); /* Going to the next MiddleWare */
    });
}
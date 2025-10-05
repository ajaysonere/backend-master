import jwt from "jsonwebtoken";

export default function authMiddleware (req, res, next){
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({
          success: false,
          message: "unauthorized access.",
          error: [{ message: "unauthorized access" }],
        });
    }
    
    const token = authHeader.split(" ")[1];
    
    jwt.verify(token , process.env.JWT_SECRET ,(err, user) => {
        if(err){
         return res
           .status(401)
           .json({
             success: false,
             message: "token is expired or invalid",
             error: [{ message: "token is expired or invalid" }],
           });
        }
        req.user = user;
        next();
    });
    
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "token is expired or invalid",
      error: [{ message: "token is expired or invalid" }],
    });
  }
};

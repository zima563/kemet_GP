import Jwt from "jsonwebtoken";
import { userModel } from "../../databases/models/user.model.js";


export const authConferming = async (req,res,next)=>{
  let { token } = req.headers;

  if (!token) return next(new apiError("not token provide", 401));

  let decoded = Jwt.verify(token, process.env.JWT_KEY);
  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new apiError("user not found",404));

  req.user = user;
  next();
}
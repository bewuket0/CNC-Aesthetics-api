import initConfig from "../config";
import jwt from "jsonwebtoken";
import { IUser } from "../config/types/user";
export const generateToken = (user: IUser) => {
  const secretKey = initConfig._jwtsecret;
  const expiresin = initConfig._jwtexpiry;

  const payload = {
    user_id: user._id,
    user_code: user.userCode,
    email: user.email,
    phone_number: user.phoneNumber,
    user_role: user.userRole,
  };

  let signedToken = jwt.sign(payload, secretKey, {
    expiresIn: expiresin,
    algorithm: "HS256",
  });

  //   console.log("token ", signedToken);

  return signedToken;
};

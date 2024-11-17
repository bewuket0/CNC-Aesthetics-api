import { unless } from "express-unless";
import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import initConfig from "../config";
import userDal from "../dal/user.dal";
import { IUser } from "../config/types/user";

interface DecodedUser {
  user_id: string;
  user_code: string;
  email: string;
  phone_number: string;
  user_role: string;
}

const authenticate = () => {
  const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("* * * Authenticating User * * * ");

    const authorization = req.get("Authorization");

    if (!authorization) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing Authorization header" });
    }

    const [scheme, token] = authorization.split(" ");
    if (scheme.toLowerCase() !== "bearer" || !token) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid Bearer token format" });
    }

    try {
      const secretKey: string = initConfig._jwtsecret;
      const verifiedToken: any = jwt.verify(token, secretKey) as DecodedUser;

      // console.log("Verified token ===>", verifiedToken);

      const { statusCode, body } = await userDal({
        method: "get",
        query: { _id: verifiedToken.user_id, isDeleted: false },
      });

      if (statusCode == 200) {
        const currentUser: IUser = body.data as IUser;

        if (!currentUser)
          return res.status(401).json({
            statusCode: 401,
            error: "The user belonging to this token does no longer exist.",
          });

        if (currentUser.passwordChangedAt) {
          const passwordChangedAt =
            new Date(currentUser.passwordChangedAt).getTime() / 1000; // Convert to UNIX timestamp in seconds

          if (verifiedToken.iat < passwordChangedAt) {
            return res.status(401).json({
              statusCode: 401,
              error:
                "Password has been changed after token issuance. Please log in again.",
            });
          }
        }

        (req as any)._user = {
          _id: currentUser._id,
          user_code: currentUser.userCode,
          phone_number: currentUser.phoneNumber,
          email: currentUser.email,
          user_role: currentUser.userRole,
          first_name: currentUser.firstName,
          last_name: currentUser.lastName,
        };
        next();
      } else {
        return res.status(401).json({
          statusCode: 401,
          type: "AUTHENTICATION_ERROR",
          error: "User with this token not found",
        });
      }
    } catch (error) {
      return res.status(401).json({
        status: 401,
        type: "AUTHENTICATION ERROR",
        error: "Invalid or expired token",
      });
    }
  };

  // Attach the `unless` method to the middleware
  authMiddleware.unless = unless;
  return authMiddleware;
};

export default authenticate;

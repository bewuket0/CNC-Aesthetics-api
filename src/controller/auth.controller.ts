import { Request, Response } from "express";
import { EventEmitter } from "stream";
import {
  loginUserSchema,
  registerUserSchema,
} from "../config/schema/user.schema";
import validate_body from "../lib/validate_body";
import userDal from "../dal/user.dal";
import { IUser } from "../config/types/user";
import { generateRandomNumber } from "../utils/utils";
import { generateHashedValue } from "../utils/generateHashedValue";
import { generateToken } from "../utils/generateToken";

const formatedReturnData = (user: IUser) => {
  return {
    user_code: user.userCode,
    first_name: user.firstName,
    last_name: user.lastName,
    phone_number: user.phoneNumber,
    email: user.email,
    role: user.userRole,
    user_joined_date: user.createdAt,
    user_modified_date: user.updatedAt,
  };
};

const checkuserexist = async (email: string, phone_number: string) => {
  try {
    const query = {
      $or: [{ email: email }, { phoneNumber: phone_number }],
      isDeleted: false,
    };

    const { statusCode, body } = await userDal({ method: "get", query });

    if (statusCode == 200) {
      return {
        statusCode: 400,
        body: {
          error: "User with this email or phone number already exists",
          data: {},
        },
      };
    } else if (statusCode == 400) {
      return { statusCode: 200, body: { error: "", data: {} } };
    } else {
      return {
        statusCode: 500,
        body: { error: "something went wrong", data: {} },
      };
    }
  } catch (error) {
    console.log("error ... ", error);

    return {
      statusCode: 400,
      body: { error: "something went wrong", data: {} },
    };
  }
};

const healthcheck = (req: Request, res: Response) => {
  res.status(200).json({
    success: "200 ok",
    message: "Server is up and running",
  });
};

const registerUser = async (req: Request, res: Response) => {
  const workflow = new EventEmitter();
  const _payload = req.body;
  // const _user = (req as any)._user
  let validated_data: any;
  let returndata = { statusCode: 400, data: {}, error: "" };

  return await new Promise((resovle) => {
    workflow.on("validate", () => {
      const { statusCode, body } = validate_body(_payload, registerUserSchema);
      if (statusCode !== 200) {
        return res.status(400).json(body);
      }
      validated_data = body.data;
      workflow.emit("checkuserexist");
    });

    workflow.on("checkuserexist", async () => {
      const { statusCode, body } = await checkuserexist(
        validated_data.email,
        validated_data.phone_number
      );
      if (statusCode !== 200) {
        return res.status(statusCode).json({
          ...returndata,
          error: body.error,
        });
      }

      workflow.emit("create");
    });

    workflow.on("create", async () => {
      const preparedata: IUser = {
        userCode: generateRandomNumber().toString(),
        firstName: validated_data.first_name,
        lastName: validated_data.last_name,
        email: validated_data.email,
        phoneNumber: validated_data.phone_number,
        gender: validated_data.gender,
        userRole: "user",
        loginPassword: generateHashedValue(validated_data.password),
      };

      const { statusCode, body } = await userDal({
        method: "create",
        data: preparedata,
      });
      if (statusCode == 201) {
        let data: any = body.data;
        const accessToken = generateToken(data);
        return res.status(201).json({
          ...returndata,
          statusCode: 201,
          data: { userdata: formatedReturnData(data), accessToken },
        });
      } else {
        return res.status(400).json({
          ...returndata,
          error: "something went wrong",
        });
      }
    });
    workflow.emit("validate", _payload);
  });
};

const login = async (req: Request, res: Response) => {
  const workflow = new EventEmitter();
  const _payload = req.body;
  let validated_data: any;
  let returndata = { statusCode: 400, data: {}, error: "" };
  let userdata: any;
  return await new Promise((resovle) => {
    workflow.on("validate", () => {
      const { statusCode, body } = validate_body(_payload, loginUserSchema);
      if (statusCode !== 200) {
        return res.status(400).json(body);
      }
      validated_data = body.data;
      workflow.emit("checkuserexist");
    });
    workflow.on("checkuserexist", async () => {
      const query = {
        email: validated_data.email,
        userRole: "user",
        isDeleted: false,
      };

      const { statusCode, body } = await userDal({ method: "get", query });
      if (statusCode !== 200) {
        return res.status(statusCode).json({
          ...returndata,
          error: body.error,
        });
      }
      userdata = body.data;

      if (
        userdata.loginPassword !== generateHashedValue(validated_data.password)
      ) {
        // ! also lets keep and lock user login try
        return res
          .status(400)
          .json({ ...returndata, error: "wrong password, please try again" });
      }
      if (!userdata.isEnabled) {
        return res
          .status(400)
          .json({ ...returndata, error: "User account is disabled" });
      }

      workflow.emit("generatetoken", userdata);
    });
    workflow.on("generatetoken", async (userdata) => {
      const accessToken = generateToken(userdata);
      return res.json({
        ...returndata,
        statusCode: 200,
        data: { userdata: formatedReturnData(userdata), accessToken },
      });
    });

    workflow.emit("validate");
  });
};

export default { healthcheck, registerUser, login };

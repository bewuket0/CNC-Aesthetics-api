import mongoose from "mongoose";
import path from "path";

import initConfig from "../config/index";
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const connect = () => {
  try {
    mongoose
      .connect(initConfig._mongodburl)
      .then(() => {
        console.log(chalk.blueBright.italic("Connection Made"));
      })
      .catch((err) => {
        console.log(err, "ERROR");
      });
  } catch (error) {
    console.error(error, "Error");
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const disconnect = () => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!mongoose.connection) {
    return;
  }

  void mongoose.disconnect();
};

export default {
  connect,
  disconnect,
};

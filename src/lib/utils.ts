import crypto from "crypto";

let PWDSecretKey = "a5K4JInQb58FysNlqvE819ztBbmC03Mx";
let PWDiv = "9HDEwrMudejuqaOW";

let getRandomArbitrary = () => {
  const min = 100000;
  const max = 999999;

  const generatedNumber = crypto.randomInt(min, max);
  return String(generatedNumber);
};

let formatPhoneNumber = (phoneNumber: string) => {
  if (String(phoneNumber).startsWith("0"))
    return "+251" + String(phoneNumber).substring(1);
  else if (String(phoneNumber).startsWith("9"))
    return "+251" + String(phoneNumber);
  else if (String(phoneNumber).startsWith("+")) return String(phoneNumber);
  else if (String(phoneNumber).startsWith("251"))
    return "+" + String(phoneNumber);
};

let localEncryptPassword = (password: string) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", PWDSecretKey, PWDiv);

  let encrypted = cipher.update(password, "utf8", "hex");

  encrypted += cipher.final("hex");
  // console.log("THIS ENCRYPTED PWD: ", encrypted);

  return encrypted;
};

let localDecryptPassword = (encryptedPassword: string) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", PWDSecretKey, PWDiv);

  let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export default {
  formatPhoneNumber,
  getRandomArbitrary,
  localEncryptPassword,
  localDecryptPassword,
};

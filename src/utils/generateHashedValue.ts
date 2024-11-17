import crypto from "crypto";
export const generateHashedValue = (value: string): string => {
  // Create a SHA-256 hash instance
  const hash = crypto.createHash("sha256");

  // Update the hash with the input string
  hash.update(value);

  // Return the resulting hash as a hexadecimal string
  return hash.digest("hex");
};

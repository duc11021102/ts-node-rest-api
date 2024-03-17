// ENCRYPTION, HASHING, CRYPTOGRAPHY PROCESSING TOOLS
import crypto from "crypto";
require("dotenv").config();
export const authentication = (salt: string, password: string): string => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET)
    .digest("hex");
};

// CREATE A RANDOM STRING OF 128 BYTE.
// CONVERT RANDOM STRING TO BASE64 STRING
export const random = () => crypto.randomBytes(128).toString("base64");

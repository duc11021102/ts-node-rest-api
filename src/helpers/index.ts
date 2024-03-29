// ENCRYPTION, HASHING, CRYPTOGRAPHY PROCESSING TOOLS
import crypto from "crypto";
import express from "express";
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

//GET CLIENT HOST NAME
export const clientHostName = (req: express.Request) => {
  const refererHeader = req.headers.referer;
  // console.log("refererHeader", refererHeader);
  let clientHostName = null;
  if (refererHeader) {
    const refererUrl = new URL(refererHeader);
    clientHostName = refererUrl.hostname;
  }
  // console.log("CLIENT HOST::", clientHostName);
  return clientHostName;
};

// CHECK HOSTNAME VALID
export const getValidDomain = (hostname: string) => {
  if (hostname === null || hostname === undefined) {
    return "";
  } else if (
    hostname === process.env.LOCAL_HOST ||
    hostname === process.env.CLIENT_HOST ||
    hostname === process.env.THUNDER_HOST ||
    hostname.includes(process.env.NGROK_HOST_NAME)
  ) {
    return hostname;
  } else return "";
};

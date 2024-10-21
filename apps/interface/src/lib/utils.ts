import { ethers } from "ethers";
import { assert } from "ts-essentials";
import { bytesToBigInt, bytesToString } from "viem";
import { z } from "zod";

export function zAddress() {
  return z
    .string()
    .startsWith("0x", {
      message: "Address must start with 0x",
    })
    .length(42, {
      message: "invalid address",
    });
}

export function decodeJwt(jwt: string) {
  const [headerBase64Url, payloadBase64Url] = splitJwt(jwt);
  const header = JSON.parse(
    bytesToString(ethers.decodeBase64(base64UrlToBase64(headerBase64Url))),
  );
  const payload = JSON.parse(
    bytesToString(ethers.decodeBase64(base64UrlToBase64(payloadBase64Url))),
  );
  const HeaderSchema = z.object({
    kid: z.string(),
  });
  const PayloadSchema = z.object({
    aud: z.string(),
    sub: z.string(),
    iss: z.string(),
    iat: z.number(),
    nonce: z.string(),
  });
  return {
    header: HeaderSchema.parse(header),
    payload: PayloadSchema.parse(payload),
  };
}

export function splitJwt(jwt: string) {
  const [headerBase64Url, payloadBase64Url, signatureBase64Url] =
    jwt.split(".");
  assert(
    headerBase64Url && payloadBase64Url && signatureBase64Url,
    "invalid jwt",
  );
  return [headerBase64Url, payloadBase64Url, signatureBase64Url] as const;
}

export function base64UrlToBase64(base64url: string) {
  // Replace '-' with '+' and '_' with '/'
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if necessary
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  return base64;
}

export function base64UrlToBigInt(base64url: string) {
  return bytesToBigInt(ethers.decodeBase64(base64UrlToBase64(base64url)));
}

export const EXTEND_SESSION_SEARCH_PARAM = {
  key: "extend-session",
  value: "true",
};

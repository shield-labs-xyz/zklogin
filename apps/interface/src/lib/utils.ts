import { utils } from "@repo/utils";
import { ethers } from "ethers";
import { assert } from "ts-essentials";
import {
  bytesToBigInt,
  bytesToString,
  size,
  type Address,
  type PublicClient,
} from "viem";
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

export async function isDeployed(
  { address }: { address: Address },
  publicClient: PublicClient,
) {
  const code = await publicClient.getCode({ address });
  const deployed = size(code ?? "0x") > 0;
  return deployed;
}

export function toBoundedVec(arr: number[], maxLen: number) {
  const storage = utils.arrayPadEnd(arr, maxLen, 0);
  return { storage, len: arr.length };
}

export function noirPackBytes(arr: number[]) {
  // keep in sync with Noir
  const arrPadded = utils.arrayPadEnd(
    arr,
    (Math.floor(arr.length / 31) + 1) * 31,
    0,
  );
  const res = [];
  for (let i = 0; i < arrPadded.length / 31; i++) {
    const chunk = arrPadded.slice(i * 31, i * 31 + 31);
    res.push(fieldFromBytes(chunk));
  }
  return res;

  function fieldFromBytes(bytes: number[]) {
    assert(
      bytes.length < 32,
      `fieldFromBytes: N must be less than 32. Got: ${bytes.length}`,
    );
    let asField = 0n;
    let offset = 1n;
    for (let i = 0; i < bytes.length; i++) {
      asField += BigInt(bytes[i]!) * offset;
      offset *= 256n;
    }
    return asField;
  }
}

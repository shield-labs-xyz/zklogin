import type { Fr } from "@aztec/bb.js";
import { utils } from "@shield-labs/utils";
import { Base64 } from "ox";
import { assert } from "ts-essentials";
import { z } from "zod";

export const HOSTED_SERVICE_URL = "https://zklogin.shield-labs.xyz";

export function decodeJwt(jwt: string) {
  const [headerBase64Url, payloadBase64Url] = splitJwt(jwt);
  const header = JSON.parse(Base64.toString(headerBase64Url));
  const payload = JSON.parse(Base64.toString(payloadBase64Url));
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

const getSharedBackend = utils.lazyValue(async () => {
  // TODO: use `Barretenberg` instead of `BarretenbergSync`. Right now, I am getting `Error: Inline worker is not supported` in SSR context.
  const { BarretenbergSync } = await import("@aztec/bb.js");
  return BarretenbergSync.getSingleton();
});

export async function pedersenHash(input: (bigint | Fr)[], index = 0) {
  const { Fr } = await import("@aztec/bb.js");
  const api = await getSharedBackend();
  const inputFields = input.map((x) => (typeof x === "bigint" ? new Fr(x) : x));
  return api.pedersenHash(inputFields, index);
}

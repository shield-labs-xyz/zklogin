import { type ClassValue, clsx } from "clsx";
import { ethers } from "ethers";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { twMerge } from "tailwind-merge";
import { assert } from "ts-essentials";
import { z } from "zod";

export * from "./utils.svelte.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number],
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>,
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

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
    ethers.toUtf8String(
      ethers.decodeBase64(base64UrlToBase64(headerBase64Url)),
    ),
  );
  const payload = JSON.parse(
    ethers.toUtf8String(
      ethers.decodeBase64(base64UrlToBase64(payloadBase64Url)),
    ),
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
  return ethers.toBigInt(ethers.decodeBase64(base64UrlToBase64(base64url)));
}

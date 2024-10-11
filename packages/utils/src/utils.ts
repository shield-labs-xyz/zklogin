import ms from "ms";
import { assert } from "ts-essentials";

export { joinURL as joinUrl } from "ufo";

export function sleep(duration: number | string) {
  const durationMs = typeof duration === "number" ? duration : ms(duration);
  return new Promise<void>((resolve) => setTimeout(resolve, durationMs));
}

export function arrayPadEnd<T>(
  array: T[],
  targetLength: number,
  padValue: T,
): T[] {
  assert(array.length <= targetLength, "arrayPadEnd: array too long");
  const newArray = array.slice();
  while (newArray.length < targetLength) {
    newArray.push(padValue);
  }
  return newArray;
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function assertConnected(account: unknown): asserts account {
  assert(account, "account is not connected");
}

export function lazyValue<T>(value: () => T): () => T {
  let initialized = false;
  let result: T;
  return () => {
    if (!initialized) {
      initialized = true;
      result = value();
    }
    return result;
  };
}

export function isAddressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Prefer this over `value.toString()` because it's typesafe(you can't accidentally call .toString() on another type when refactoring)
 */
export function bigIntToString(value: bigint) {
  return value.toString();
}

export function errorToString(error: any) {
  return String(error?.message || error);
}

export function removePrefixOrThrow(str: string, prefix: string) {
  if (!str.startsWith(prefix)) {
    throw new Error(`string does not start with "${prefix}"`);
  }

  return str.slice(prefix.length);
}

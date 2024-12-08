import { assert } from "ts-essentials";
import { size, type Address, type PublicClient } from "viem";
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

// taken from here https://github.com/colinhacks/zod/issues/831#issuecomment-1063481764
export function zUnionFromArray<T extends readonly z.Primitive[]>(
  values: T,
): z.ZodType<T[number]> {
  assert(values.length > 0, "trying to create an empty ZodUnion");
  if (values.length === 1) {
    return z.literal(values[0]);
  }
  return createUnion(
    values as unknown as Readonly<[z.Primitive, z.Primitive, ...z.Primitive[]]>,
  );

  function createUnion<
    T extends Readonly<[z.Primitive, z.Primitive, ...z.Primitive[]]>,
  >(values: T) {
    const zodLiterals = values.map((value) => z.literal(value)) as unknown as [
      z.ZodLiteral<z.Primitive>,
      z.ZodLiteral<z.Primitive>,
      ...z.ZodLiteral<z.Primitive>[],
    ];
    return z.union(zodLiterals);
  }
}

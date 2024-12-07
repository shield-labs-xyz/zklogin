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

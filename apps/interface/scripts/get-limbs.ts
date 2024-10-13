import {
  bnToLimbStrArray,
  bnToRedcLimbStrArray,
} from "@mach-34/noir-bignum-paramgen";
import { bytesToBigInt } from "viem";
function main() {
  const sig =
    "aA4krOjc53KW4UH3gtg2XCNR4ezTGAVN7erKVZCirG_J-Jaf0zzOe_ylqpAGXLJ1lCOdA1QjGrKsfEbyTN6PafITnoCXdUjm8sEVXDi89OAGoGbSS1gBWsH0b7y1f6dU26M8YVGvU-pubXmBOIIhV0Fgma2IVeAjh3gI7B45XyvTFx2Y2Qs7Qe5XiYAurQIgzsG9nN-lKVYYcr74Nsr2KtjyTZvR2I7jEq-keHtkLCeJIgZ4iEQwpAvREhD84fvgSAuZ9K7MswrJOIIL-UiSGqlWTXb7AxOBGs-TMWkaRHuUyRcluwz6xKD4989LvH9g496z2eZcg_CZuoHBlec61w";

  const pubkey =
    "4VI56fF0rcWHHVgHFLHrmEO5w8oN9gbSQ9TEQnlIKRg0zCtl2dLKtt0hC6WMrTA9cF7fnK4CLNkfV_Mytk-rydu2qRV_kah62v9uZmpbS5dcz5OMXmPuQdV8fDVIvscDK5dzkwD3_XJ2mzupvQN2reiYgce6-is23vwOyuT-n4vlxSqR7dWdssK5sj9mhPBEIlfbuKNykX5W6Rgu-DyuoKRc_aukWnLxWN-yoroP2IHYdCQm7Ol08vAXmrwMyDfvsmqdXUEx4om1UZ5WLf-JNaZp4lXhgF7Cur5066213jwpp4f_D3MyR-oa43fSa91gqp2berUgUyOWdYSIshABVQ";
  const pubkey_limbs = bnToLimbStrArray(toBigInt(pubkey));
  const pubkey_redc_limbs = bnToRedcLimbStrArray(toBigInt(pubkey));
  const signature_limbs = bnToLimbStrArray(toBigInt(sig));
  console.log(`
    let pubkey_limbs = [${pubkey_limbs.join(", ")}];
    let pubkey_redc_limbs = [${pubkey_redc_limbs.join(", ")}];
    let signature_limbs = [${signature_limbs.join(", ")}];
    `);
}

function toBigInt(b64: string) {
  return bytesToBigInt(Buffer.from(b64, "base64url"));
}

main();

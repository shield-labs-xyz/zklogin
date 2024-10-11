import "dotenv/config";
import { z } from "zod";
import { zPrivateKey } from "./shared/utils";

/**
 * Parse env variables in a typesafe way.
 */
const EnvConfigSchema = z.object({
  DEPLOYER_PRIVATE_KEY: zPrivateKey(),
});

let envConfig: z.infer<typeof EnvConfigSchema>;
try {
  envConfig = EnvConfigSchema.parse(process.env);
} catch (e: any) {
  throw new Error(
    `Error parsing .env file: ${e.errors[0].path} ${e.errors[0].message}`,
  );
}
export default envConfig;

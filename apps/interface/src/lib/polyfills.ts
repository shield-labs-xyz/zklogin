import { Buffer } from "buffer";

globalThis.Buffer ??= Buffer;
// @ts-expect-error
globalThis.process ??= { env: {} };

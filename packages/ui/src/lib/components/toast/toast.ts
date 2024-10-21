import type { ComponentProps, SvelteComponent } from "svelte";
import frenchToast, {
  type Toast as FrenchToast,
  type Renderable,
  type ToastOptions,
} from "svelte-french-toast";
import { errorToString } from "../../utils.js";
import ConfirmToast from "./ConfirmToast.svelte";

export { Toaster } from "svelte-french-toast";

export type Toast<TProps> = FrenchToast & { props: TProps };

const duration = 5_000;
export const toast = {
  success: (msg: Renderable, options?: ToastOptions) => {
    return frenchToast.success(msg, { duration, ...options });
  },
  log(msg: Renderable, options?: ToastOptions) {
    if (typeof msg === "string") {
      console.log(msg);
    }
    return frenchToast(msg, { duration, ...options });
  },
  error(error: unknown, options?: ToastOptions) {
    console.error(error);
    const errStr = errorToString(error);
    return frenchToast.error(errStr, { duration, ...options });
  },
  promise: async <T>(
    promise: Promise<T>,
    msgs: string | Parameters<typeof frenchToast.promise>[1],
    options?: Parameters<typeof frenchToast.promise>[2],
  ) => {
    if (typeof msgs === "string") {
      msgs = {
        loading: `Loading ${msgs}...`,
        success: `Loaded ${msgs}!`,
        error: `Error loading ${msgs}`,
      };
    }
    if (typeof msgs.loading === "string") {
      console.log(msgs.loading);
    }
    try {
      const value = await frenchToast.promise(promise, msgs, {
        ...options,
        success: { duration },
        error: { duration },
      });
      console.log(
        typeof msgs.success !== "function"
          ? msgs.success
          : `Success ${msgs.loading}`,
      );
      return value;
    } catch (err) {
      console.error(
        typeof msgs.error !== "function" ? msgs.error : `Error ${msgs.loading}`,
      );
      console.error(err);
      throw err;
    }
  },
  confirm(
    props: Omit<ComponentProps<ConfirmToast>["toast"]["props"], "onresult">,
    { duration = Infinity, ...options }: ToastOptions = {},
  ) {
    return new Promise<boolean>((resolve) => {
      toastCustomTypesafe(ConfirmToast, {
        ...options,
        duration,
        props: {
          ...props,
          onresult: resolve,
        },
      });
    });
  },
  custom: toastCustomTypesafe,
  dismiss: frenchToast.dismiss.bind(frenchToast),
};

function toastCustomTypesafe<
  T extends typeof SvelteComponent<{ toast: Toast<unknown> }>,
>(
  component: T,
  options: ToastOptions & {
    props: ComponentProps<InstanceType<T>>["toast"]["props"];
  },
) {
  return frenchToast(component, options);
}

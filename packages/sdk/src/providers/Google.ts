import { utils } from "@shield-labs/utils";
import { decodeJwt } from "../utils.js";

export class GoogleProvider {
  constructor(private authGoogleClientId: string) {}

  async signInWithGoogle({ nonce }: { nonce: string }): Promise<string> {
    let jwtStr: string;
    try {
      // First, try One Tap sign-in
      jwtStr = await this.#signInWithGoogleOneTap({ nonce });
    } catch (error) {
      console.log(
        "One Tap sign-in failed, falling back to popup method",
        error,
      );
      // If One Tap fails, fall back to popup method
      jwtStr = await this.#signInWithGooglePopup({ nonce });
    }
    const jwt = decodeJwt(jwtStr);

    if (jwt.payload.nonce !== nonce) {
      throw new Error("Invalid nonce");
    }

    return jwtStr;
  }

  async #signInWithGoogleOneTap({ nonce }: { nonce: string }): Promise<string> {
    await this.#loadGoogleOAuthScript();

    return new Promise((resolve, reject) => {
      window.google!.accounts.id.initialize({
        client_id: this.authGoogleClientId,
        callback: (response: { credential: string; error: string }) => {
          if (response.error) {
            reject(response.error);
          } else {
            const idTokenStr = response.credential;
            resolve(idTokenStr);
          }
        },
        nonce: nonce,
        context: "signin",
      });

      // @ts-expect-error its valid to pass this callback
      window.google!.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject("One Tap not displayed or skipped");
        }
      });
    });
  }

  async #signInWithGooglePopup({ nonce }: { nonce: string }): Promise<string> {
    // Generate a random state
    const state = Math.random().toString(36).substring(2, 15);

    // Store the state and nonce in localStorage
    localStorage.setItem(localStorageKeys.GoogleOAuthState, state);
    localStorage.setItem(localStorageKeys.GoogleOAuthNonce, nonce);

    // Construct the Google OAuth URL
    const redirectUri = `${window.location.origin}/auth/callback/google`;
    const scope = "openid";
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.search = new URLSearchParams({
      client_id: this.authGoogleClientId,
      redirect_uri: redirectUri,
      response_type: "id_token",
      scope,
      state,
      nonce,
    }).toString();

    // Open the auth window
    const authWindow = window.open(authUrl, undefined, "width=500,height=600");

    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === "GOOGLE_SIGN_IN_ERROR") {
          cleanup();
          reject(new Error(event.data.error));
          return;
        }

        if (event.data.type === "GOOGLE_SIGN_IN_SUCCESS") {
          const { idToken, state: returnedState } = event.data;

          // Verify the state
          if (
            returnedState !==
            localStorage.getItem(localStorageKeys.GoogleOAuthState)
          ) {
            cleanup();
            reject(new Error("Invalid state parameter"));
            return;
          }

          cleanup();
          resolve(idToken);
          return;
        }

        console.error(`Invalid message type: ${event.data.type}`);
      };

      window.addEventListener("message", handleMessage);

      // Periodically check if the auth window is still open
      const checkInterval = setInterval(() => {
        if (authWindow && authWindow.closed) {
          console.log("auth window closed", authWindow.closed);
          cleanup();
          reject(new Error("Authentication cancelled"));
        }
      }, 1000);

      // Set a timeout for the authentication process
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Authentication timed out"));
      }, 120000); // 2 minutes timeout

      // Clean up the timeout if authentication succeeds
      window.addEventListener(
        "message",
        () => {
          cleanup();
        },
        { once: true },
      );

      function cleanup() {
        localStorage.removeItem(localStorageKeys.GoogleOAuthState);
        localStorage.removeItem(localStorageKeys.GoogleOAuthNonce);
        clearInterval(checkInterval);
        clearTimeout(timeout);
        window.removeEventListener("message", handleMessage);
      }
    });
  }

  #loadGoogleOAuthScript = utils.lazyValue(() => {
    return new Promise<void>((resolve) => {
      if (typeof window.google !== "undefined" && window.google.accounts) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  });
}

const localStorageKeys = {
  GoogleOAuthState: "googleOAuthState",
  GoogleOAuthNonce: "googleOAuthNonce",
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (params: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

import Cookies from "js-cookie";

export class GoogleProvider {
  constructor(private authGoogleClientId: string) {}

  async getJwt(): Promise<string | undefined> {
    return Cookies.get(JWT_COOKIE_KEY);
  }

  async signInWithRedirect({ nonce }: { nonce: string }): Promise<never> {
    // Generate a random state
    const state = crypto.randomUUID();

    await this.#setOauthState(state);

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
    window.location.href = authUrl.toString();
    return await new Promise<never>(() => {}); // never resolves
  }

  async signOut() {
    Cookies.remove(JWT_COOKIE_KEY);
  }

  async handleRedirect(
    loc: Pick<URL, "hash"> = window.location,
  ): Promise<void> {
    const savedState = await this.#useOauthState(); // must be consumed as the first step to prevent replay attacks

    const hashParams = new URLSearchParams(loc.hash.slice(1));
    const idToken = hashParams.get("id_token");
    const state = hashParams.get("state");
    const error = hashParams.get("error");

    if (error) {
      throw new Error(error);
    }

    if (!idToken || !state) {
      throw new Error("Invalid Google OAuth response");
    }

    if (savedState !== state) {
      throw new Error("Invalid Google OAuth state");
    }

    await this.#setJwt(idToken);
  }

  async #setJwt(jwt: string) {
    Cookies.set(JWT_COOKIE_KEY, jwt);
  }

  async #setOauthState(state: string) {
    sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);
  }

  async #useOauthState() {
    const state = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
    sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
    if (!state) {
      throw new Error("Invalid Google OAuth saved state");
    }
    return state;
  }
}

const OAUTH_STATE_STORAGE_KEY = "zklogin-google-oauth-state";
const JWT_COOKIE_KEY = "zklogin-google-jwt";

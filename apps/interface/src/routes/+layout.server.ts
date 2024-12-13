export async function load(event) {
  // set these headers to enable multithreaded proving
  event.setHeaders({
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
  });

  // const session = (await event.locals.auth()) as
  //   | (Session & { id_token?: string })
  //   | null;
  const session = null;

  return {
    session,
  };
}

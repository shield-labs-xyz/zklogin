// import { SvelteKitAuth } from "@auth/sveltekit";
// import Google from "@auth/sveltekit/providers/google";

// export const { handle } = SvelteKitAuth({
//   trustHost:
//     process.env.AUTH_TRUST_HOST == null
//       ? undefined
//       : process.env.AUTH_TRUST_HOST === "true",
//   providers: [Google({})],
//   callbacks: {
//     jwt: async ({ token, account }) => {
//       if (account?.id_token) {
//         // forward the id_token to the session
//         token._id_token = account?.id_token;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (session as any).id_token = token._id_token;
//       return session;
//     },
//   },
// });
